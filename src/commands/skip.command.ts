import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import PlayManager from '../core/PlayManager';
import queryHandler from '../core/QueryHandler';
import { Command } from './abstract/command.abstract';

class Skip extends Command {
    _data: any;
    private message = {
        play: 'Playing',
        queue: 'Queued',
    };

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setDescription('Skip the current track')
            .setName('skip');
    }

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const connectionState = PlayManager.getConnectionState(
            interaction.guildId!,
        );

        if (!connectionState) {
            await interaction.editReply({
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
                                content: `${this.message[now?.action!]} ${
                                    now?.title
                                }`,
                            });
                        });
                    }
                });
        } else {
            await interaction.editReply({
                content: 'No more tracks in queue',
            });

            PlayManager.deleteConnectionState(interaction.guildId!);

            connectionState.subscription.connection.destroy();
        }

        return Promise.resolve();
    }
}

export default Skip;
