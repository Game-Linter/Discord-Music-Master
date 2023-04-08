import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import { GuildPlaylist, Playlist } from '../persistence/models/Playlist';
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

        const guildPlaylists =
            (await GuildPlaylist.get<Playlist>(interaction.guildId!)) ??
            new Map<string, string>();

        guildPlaylists.set(name, link);

        const savedPlaylist = new GuildPlaylist(interaction.guildId!);

        savedPlaylist.value = guildPlaylists;

        try {
            await savedPlaylist.save();

            interaction.reply({
                content: `Saved ${name} to ${interaction.guild?.name}`,
                ephemeral: false,
            });
        } catch (error: any) {
            interaction.reply({
                content: `Failed to save ${name} to ${interaction.guild?.name}`,
                ephemeral: false,
            });

            console.error(error.message);
        }

        return;
    }
}

export default Save;
