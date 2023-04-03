import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from './command.abstract';

export class Skip extends Command {
    _data = new SlashCommandBuilder().setDescription('Skip').setName('skip');

    execute(message: ChatInputCommandInteraction): Promise<void> {
        throw new Error('Method not implemented.');
    }

    get data() {
        return this._data;
    }
}
