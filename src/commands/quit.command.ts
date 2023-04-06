import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import PlayManager from '../core/PlayManager';
import { Command } from './abstract/command.abstract';

class Quit extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('quit')
            .setDescription('Quit the bot from the voice channel');
    }

    execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        interaction.reply('Bye bye!');

        const connectionState = PlayManager.getConnectionState(
            interaction.guildId!,
        );

        if (!connectionState) return Promise.resolve();

        connectionState.subscription.player.stop();
        connectionState.subscription.connection.destroy();

        PlayManager.deleteConnectionState(interaction.guildId!);

        return Promise.resolve();
    }
}

export default Quit;
