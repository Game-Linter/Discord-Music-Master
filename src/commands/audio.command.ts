import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    NoSubscriberBehavior,
    StreamType,
} from '@discordjs/voice';
import {
    ChatInputCommandInteraction,
    Message,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import queryHandler from '../core/queryHandler';
import { Command } from './command.abstract';
import ytdl from 'ytdl-core-discord';

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

        const handler = await queryHandler.handle(
            interaction.options.getString('url-or-query')!,
        );

        if (!handler) {
            interaction.followUp({
                content: 'No results found!',
                ephemeral: true,
            });

            return Promise.resolve();
        }

        if (Array.isArray(handler)) {
            interaction.reply({
                content: 'Multiple results found!',
                ephemeral: true,
            });

            return Promise.resolve();
        }

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        audioPlayer.play(
            createAudioResource(
                await ytdl(handler.url!, {
                    filter: 'audioonly',
                    highWaterMark: 1 << 25,
                }),
                {
                    inputType: StreamType.Opus,
                },
            ),
        );

        const subscription = voiceConnection.subscribe(audioPlayer);

        interaction.reply({
            content: `Playing ${handler.title ?? handler.url}`,
            ephemeral: true,
        });

        return Promise.resolve();
    }

    get data() {
        return this._data;
    }
}

export default Audio;
