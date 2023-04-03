import {
    ChatInputCommandInteraction,
    Message,
    SlashCommandBuilder,
} from 'discord.js';

export abstract class Command {
    abstract _data: any;

    abstract get data(): any;

    abstract execute(message: ChatInputCommandInteraction): Promise<void>;
}
