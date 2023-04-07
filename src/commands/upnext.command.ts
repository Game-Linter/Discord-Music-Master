import {
    ChatInputCommandInteraction,
    CacheType,
    SlashCommandBuilder,
} from 'discord.js';
import PlayManager from '../core/PlayManager';
import { Command } from './abstract/command.abstract';

class Upnext extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('upnext')
            .setDescription('Shows the next song in the queue');
    }

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const connectionState = PlayManager.getConnectionState(
            interaction.guildId!,
        );

        if (!connectionState) {
            interaction.reply({
                content: 'Not playing anything',
                ephemeral: true,
            });

            return;
        }

        const nextTrack = connectionState.next();

        if (!nextTrack) {
            interaction.reply({
                content: 'Nothing in queue',
                ephemeral: true,
            });

            return;
        }

        interaction.reply({
            embeds: [
                {
                    title: 'Next track',
                    description: `playing next: ${nextTrack}`,
                },
            ],
        });

        return;
    }
}

export default Upnext;
