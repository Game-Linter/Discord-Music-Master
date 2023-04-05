import {
    ChatInputCommandInteraction,
    CacheType,
    SlashCommandBuilder,
} from 'discord.js';
import PlayManager from '../core/PlayManager';
import queryHandler from '../core/QueryHandler';
import { Command } from './abstract/command.abstract';

class Skip extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setDescription('Skip the current track')
            .setName('skip');
    }

    execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        interaction.deferReply({
            ephemeral: true,
        });

        const connectionState = PlayManager.getConnectionState(
            interaction.guildId!,
        );

        if (!connectionState) {
            interaction.editReply({
                content: 'Not even in channel bro, based!',
            });

            return Promise.resolve();
        }

        console.log(connectionState.currentTrack, connectionState.hasNext());

        if (connectionState.hasNext()) {
            connectionState.shiftQueue();

            connectionState.playing = false;

            queryHandler
                .handle(connectionState.currentTrack!)
                .then((result) => {
                    if (result) {
                        PlayManager.enqueueAudio(
                            result,
                            connectionState.subscription.connection,
                        ).then((now) => {
                            interaction.editReply({
                                content: `Playing ${now}`,
                            });
                        });
                    }
                });
        } else {
            interaction.editReply({
                content: 'No more tracks in queue',
            });

            connectionState.subscription.connection.destroy();
        }

        return Promise.resolve();
    }
}

export default Skip;
