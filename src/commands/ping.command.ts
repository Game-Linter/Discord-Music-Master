import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from './abstract/command.abstract';

class Ping extends Command {
    _data = new SlashCommandBuilder().setDescription('Ping!').setName('ping');

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: `${
                new Date().getTime() - interaction.createdTimestamp
            }ms}`,
        });
    }

    get data() {
        return this._data;
    }
}

export default Ping;
