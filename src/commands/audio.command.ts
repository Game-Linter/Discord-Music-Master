import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import {
    ChatInputCommandInteraction,
    Message,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import queryHandler from '../core/queryHandler';
import { Command } from './command.abstract';

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
        const voiceChannel = await interaction.guild?.members
            .fetch(interaction.member?.user.id!)
            .then((member) => member.voice.channelId);

        if (!voiceChannel) {
            interaction.reply({
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

        console.log(handler);

        return Promise.resolve();
    }

    get data() {
        return this._data;
    }
}

export default Audio;
