import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import { ResultUrl } from '../core/abstract/UrlHandler';
import playManager from '../core/PlayManager';
import queryHandler from '../core/QueryHandler';
import { Command } from './abstract/command.abstract';

class Audio extends Command {
    private message = {
        queue: 'Added to queue',
        play: 'Playing',
    };

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

        let voiceConnection = getVoiceConnection(interaction.guildId!);

        if (!voiceConnection) {
            voiceConnection = joinVoiceChannel({
                channelId: voiceChannel,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild?.voiceAdapterCreator!,
            });
        }

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

        const played = await playManager.enqueueAudio(
            result as ResultUrl | ResultUrl[],
            voiceConnection,
        );

        if (played)
            interaction.editReply({
                content: `${this.message[played.action]} ${played.title}`,
            });

        return Promise.resolve();
    }
}

export default Audio;
