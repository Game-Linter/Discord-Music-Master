import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import { GuildPlaylist } from '../persistence/models/Playlist';
import { Command } from './abstract/command.abstract';

class Save extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('save')
            .setDescription(
                'Saves a track-or-playlist to this server with a name',
            )
            .addStringOption((option) =>
                option
                    .setName('name')
                    .setDescription('The track to save')
                    .setRequired(true),
            )
            .addStringOption((option) =>
                option
                    .setName('track-or-playlist')
                    .setDescription('The link to save')
                    .setRequired(true),
            );
    }

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const { name, link } = {
            name: interaction.options.getString('name', true),
            link: interaction.options.getString('track-or-playlist', true),
        };

        let guildPlaylists = await GuildPlaylist.get<GuildPlaylist>(
            interaction.guildId!,
        );

        if (!guildPlaylists) {
            guildPlaylists = new GuildPlaylist(interaction.guildId!);

            guildPlaylists.value = new Map<string, string>();

            guildPlaylists.value.set(name, link);

            await guildPlaylists.save();
        }

        const playlists =
            (await guildPlaylists.get()) || new Map<string, string>();

        try {
            playlists.set(name, link);

            guildPlaylists.value = playlists;

            await guildPlaylists.save();

            interaction.reply({
                content: `Saved ${name} to ${interaction.guildId}`,
                ephemeral: true,
            });
        } catch (error: any) {
            interaction.reply({
                content: 'Failed to save',
                ephemeral: true,
            });

            console.error(error.message);
        }

        return;
    }
}

export default Save;
