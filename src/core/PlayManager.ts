import {
    AudioPlayer,
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
    ): Promise<string | null> {
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
            return Promise.resolve(null);
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
            async () => {
                connectionState!.playing = false;

                if (connectionState!.isLooping) {
                    await this.enqueueAudio(query, voiceConnection);
                } else {
                    connectionState!.shiftQueue();

                    if (connectionState!.hasNext()) {
                        const result = await queryHandler.handle(
                            connectionState!.currentTrack!,
                        );

                        if (result) {
                            await this.enqueueAudio(result, voiceConnection);
                        }
                    } else {
                        voiceConnection.destroy();
                        this.deleteConnectionState(
                            voiceConnection.joinConfig.guildId,
                        );
                        return Promise.resolve(null);
                    }
                }
            },
        );

        return Promise.resolve(connectionState.currentTrack!);
    }
}

export default new PlayManager();
