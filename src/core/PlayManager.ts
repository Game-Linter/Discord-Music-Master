import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    PlayerSubscription,
    StreamType,
    VoiceConnection,
} from '@discordjs/voice';
import { TextChannel } from 'discord.js';
import ytdl from 'ytdl-core-discord';
import { client } from '..';
import { ResultUrl } from './abstract/UrlHandler';
import { ConnectionState } from './ConnectionState';
import queryHandler from './QueryHandler';

type GuildId = string;

import { Result } from './QueryHandler';

class PlayManager {
    private players = new Map<GuildId, ConnectionState>();

    public getConnectionState(guildId: string) {
        return this.players.get(guildId);
    }

    public createConnectionState(guildId: GuildId, player: PlayerSubscription) {
        const connectionState = new ConnectionState(player);

        this.players.set(guildId, connectionState);

        return connectionState;
    }

    public hasConnectionState(guildId: GuildId) {
        return this.players.has(guildId);
    }

    public deleteConnectionState(guildId: GuildId) {
        return this.players.delete(guildId);
    }

    public next(guildId: GuildId) {
        if (!this.hasConnectionState(guildId)) return;

        const connectionState = this.players.get(guildId) as ConnectionState;

        if (!connectionState.hasNext()) return;

        connectionState.shiftQueue();

        const nextTrack = connectionState.currentTrack;

        return nextTrack;
    }

    public async enqueueAudio(
        query: Result,
        voiceConnection: VoiceConnection,
    ): Promise<{
        title: string;
        action: 'play' | 'queue';
    } | null> {
        if (!query) return Promise.resolve(null);

        let connectionState = this.getConnectionState(
            voiceConnection.joinConfig.guildId,
        );

        if (!connectionState) {
            const audioPlayer = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });

            const subscription = voiceConnection.subscribe(audioPlayer);

            connectionState = this.createConnectionState(
                voiceConnection.joinConfig.guildId,
                subscription!,
            );
        }

        if (connectionState.playing) {
            connectionState.pushQueue(query as any); // TODO: fix this type

            connectionState.emit(
                'queue',
                connectionState.next()!,
                voiceConnection.joinConfig.guildId,
            );

            return Promise.resolve({
                title: Array.isArray(query)
                    ? `playlist starting with : ${query[0].title}`
                    : query.title ?? query.url!,
                action: 'queue',
            });
        }

        connectionState.pushQueue(query as any); // TODO: fix this type
        connectionState.shiftQueue();

        const { url } = (await queryHandler.handle(
            connectionState.currentTrack!,
        )) as ResultUrl;

        if (!url) {
            connectionState.subscription.player.stop(true);
            return Promise.resolve(null);
        }

        connectionState.subscription.player.play(
            createAudioResource(
                await ytdl(url!, {
                    filter: 'audioonly',
                    highWaterMark: 1 << 25,
                }),
                {
                    inputType: StreamType.Opus,
                },
            ),
        );

        connectionState.playing = true;

        connectionState.subscription.player.on(
            AudioPlayerStatus.Idle,
            this.idleHandler(connectionState, query),
        );

        connectionState.subscription.player.on(
            AudioPlayerStatus.Playing,
            () => {
                // send a message to the channel that the bot is playing in
                connectionState?.emit(
                    'play',
                    connectionState.currentTrack!,
                    connectionState.subscription.connection.joinConfig.guildId,
                );
            },
        );

        return Promise.resolve({
            title: connectionState.currentTrack!,
            action: 'play',
        });
    }

    private idleHandler(connectionState: ConnectionState, query: Result) {
        return async () => {
            connectionState!.playing = false;

            if (connectionState!.isLooping) {
                await this.enqueueAudio(
                    query,
                    connectionState.subscription.connection,
                );
            } else {
                if (connectionState!.hasNext()) {
                    connectionState!.shiftQueue();

                    const result = await queryHandler.handle(
                        connectionState!.currentTrack!,
                    );

                    await this.enqueueAudio(
                        result,
                        connectionState.subscription.connection,
                    );
                } else {
                    connectionState.subscription.connection.destroy();
                    this.deleteConnectionState(
                        connectionState.subscription.connection.joinConfig
                            .guildId,
                    );
                    return Promise.resolve(null);
                }
            }
        };
    }
}

export default new PlayManager();
