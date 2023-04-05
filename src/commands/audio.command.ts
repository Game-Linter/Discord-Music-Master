import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnection,
} from '@discordjs/voice';
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import { ResultUrl } from '../core/abstract/UrlHandler';
import playManager from '../core/PlayManager';
import queryHandler, { Result } from '../core/QueryHandler';
import { Command } from './abstract/command.abstract';

class Audio extends Command {
    _data = new SlashCommandBuilder()
        .setDescription('Play audio')
        .setName('audio')
        .addStringOption((option) =>
            option
                .setName('url-or-query')
                .setDescription('The url or the search query')
                .setRequired(true),
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Connect |
                PermissionFlagsBits.Speak |
                PermissionFlagsBits.ViewChannel,
        );

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const voiceChannel = await interaction.guild?.members
            .fetch(interaction.member?.user.id!)
            .then((member) => member.voice.channelId);

        if (!voiceChannel) {
            interaction.followUp({
                content:
                    'You need to be in a voice channel to use this command!',
                ephemeral: true,
            });
            return Promise.resolve();
        }

        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel,
            guildId: interaction.guildId!,
            adapterCreator: interaction.guild?.voiceAdapterCreator!,
        });

        const result = await queryHandler.handle(
            interaction.options.getString('url-or-query')!,
        );

        if (!result) {
            await interaction.editReply({
                content: 'No results found!',
            });

            return Promise.resolve();
        }

        // call enqueueAudio

        const played = await this.enqueueAudio(
            result as ResultUrl | ResultUrl[],
            voiceConnection,
        );

        if (played)
            interaction.editReply({
                content: `Playing ${played}`,
            });

        return Promise.resolve();
    }

    private async enqueueAudio(
        query: Result,
        voiceConnection: VoiceConnection,
    ): Promise<string | null> {
        if (!query) return Promise.resolve(null);

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        // if (Array.isArray(query)) {
        //     // TODO: handle array

        //     return Promise.resolve();
        // }

        voiceConnection.subscribe(audioPlayer);

        let connectionState = playManager.getConnectionState(
            voiceConnection.joinConfig.guildId,
        );

        if (!connectionState) {
            connectionState = playManager.createConnectionState(
                voiceConnection.joinConfig.guildId,
                audioPlayer,
            );
        }

        connectionState.pushQueue(query as any); // TODO: fix this type

        audioPlayer.play(
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

        audioPlayer.on('error', (error) => {
            console.error(
                `Error encountered in voice connection ${voiceConnection.joinConfig.guildId}: ${error}`,
            );
        });

        audioPlayer.on(AudioPlayerStatus.Idle, async () => {
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
                }
            }
        });

        return Promise.resolve(connectionState.currentTrack!);
    }

    get data() {
        return this._data;
    }
}

export default Audio;
