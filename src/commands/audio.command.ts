import { joinVoiceChannel } from '@discordjs/voice';
import {
    ChatInputCommandInteraction,
    Message,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from './command.abstract';

class Audio extends Command {
    _data = new SlashCommandBuilder()
        .setDescription('Play audio')
        .setName('audio')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('The url oh the search query')
                .setRequired(true),
        );

    execute(interaction: ChatInputCommandInteraction): Promise<void> {
        interaction.reply('Audio command!');

        const memeber = interaction.guild?.members.cache.get(
            interaction.member?.user.id!,
        );

        joinVoiceChannel({
            channelId: memeber?.voice.channelId!,
            guildId: interaction.guildId!,
            adapterCreator: interaction.guild!.voiceAdapterCreator,
        });

        return Promise.resolve();
    }

    get data() {
        return this._data;
    }
}

export default Audio;
