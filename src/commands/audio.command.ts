import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from './command.abstract';

export class Audio extends Command {
    _data = new SlashCommandBuilder()
        .setDescription('Play audio')
        .addStringOption((option) =>
            option
                .setName('url')
                .setDescription('The url oh the search query')
                .setRequired(true),
        );

    execute(message: ChatInputCommandInteraction): Promise<void> {
        throw new Error('Method not implemented.');
    }

    get data() {
        return this._data;
    }
}
