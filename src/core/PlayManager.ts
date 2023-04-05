import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    PlayerSubscription,
    StreamType,
    VoiceConnection,
} from '@discordjs/voice';
import ytdl from 'ytdl-core-discord';
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
            return Promise.resolve({
                title: connectionState.next()!,
                action: 'queue',
            });
        }

        connectionState.pushQueue(query as any); // TODO: fix this type
        connectionState.shiftQueue();

        connectionState.subscription.player.play(
            createAudioResource(
                await ytdl(connectionState.currentTrack!, {
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
            this.idleHandler(connectionState, voiceConnection, query),
        );

        return Promise.resolve({
            title: connectionState.currentTrack!,
            action: 'play',
        });
    }

    private idleHandler(
        connectionState: ConnectionState,
        voiceConnection: VoiceConnection,
        query: Result,
    ) {
        return async () => {
            connectionState!.playing = false;

            if (connectionState!.isLooping) {
                await this.enqueueAudio(query, voiceConnection);
            } else {
                if (connectionState!.hasNext()) {
                    connectionState!.shiftQueue();

                    const result = await queryHandler.handle(
                        connectionState!.currentTrack!,
                    );

                    await this.enqueueAudio(result, voiceConnection);
                } else {
                    voiceConnection.destroy();
                    this.deleteConnectionState(
                        voiceConnection.joinConfig.guildId,
                    );
                    return Promise.resolve(null);
                }
            }
        };
    }
}

export default new PlayManager();
