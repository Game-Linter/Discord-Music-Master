import { Command } from './abstract/command.abstract';
import playManager from '../core/PlayManager';
import { SlashCommandBuilder } from 'discord.js';

class Resume extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('resume')
            .setDescription('Resume the current song');
    }

    execute(message: any): Promise<void> {
        const connectionStatus = playManager.getConnectionState(
            message.guildId as string,
        );

        if (!connectionStatus) {
            message.reply('There is no song playing');
            return Promise.resolve();
        }

        const { player } = connectionStatus.subscription;

        if (!connectionStatus.playing) {
            player.unpause();
            connectionStatus.playing = true;
            message.reply('Resumed');
        } else {
            message.reply('The song is already playing');
        }

        return Promise.resolve();
    }
}

export default Resume;
