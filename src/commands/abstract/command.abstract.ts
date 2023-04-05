import { ChatInputCommandInteraction } from 'discord.js';

export abstract class Command {
    abstract _data: any;

    get data() {
        return this._data;
    }

    abstract execute(message: ChatInputCommandInteraction): Promise<void>;
}
