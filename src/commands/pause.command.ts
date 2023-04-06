import {
    ChatInputCommandInteraction,
    CacheType,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from './abstract/command.abstract';
import playManager from '../core/PlayManager';

class Pause extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('pause')
            .setDescription('Pause the current song');
    }

    execute(message: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const connectionStatus = playManager.getConnectionState(
            message.guildId as string,
        );

        if (!connectionStatus) {
            message.reply('There is no song playing');
            return Promise.resolve();
        }

        const { player } = connectionStatus.subscription;

        if (connectionStatus.playing) {
            player.pause(true);
            connectionStatus.playing = false;
            message.reply('Paused');
        } else {
            message.reply('The song is already paused');
        }

        return Promise.resolve();
    }
}

export default Pause;
