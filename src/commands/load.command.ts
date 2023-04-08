import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import {
    CacheType,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';
import PlayManager from '../core/PlayManager';
import queryHandler from '../core/QueryHandler';
import { GuildPlaylist, Playlist } from '../persistence/models/Playlist';
import { Command } from './abstract/command.abstract';

class LoadCommand extends Command {
    _data: any;

    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('load')
            .setDescription('loads a saved track/playlist from this server')
            .addStringOption((option) =>
                option
                    .setName('name')
                    .setDescription('The name of the playlist or track to load')
                    .setRequired(true),
            );
    }

    async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        await interaction.deferReply({
            ephemeral: true,
        });

        const voiceChannel = await interaction.guild?.members
            .fetch(interaction.member?.user.id!)
            .then((member) => member.voice.channelId);

        if (!voiceChannel) {
            interaction.editReply({
                content:
                    'You need to be in a voice channel to use this command!',
            });
            return;
        }

        const name = interaction.options.getString('name', true);

        const guildPlaylists =
            (await GuildPlaylist.get<Playlist>(interaction.guildId!)) ??
            new Map<string, string>();

        const playlist = guildPlaylists.get(name);

        if (!playlist) {
            interaction.editReply({
                content: `No playlist with the name ${name} found`,
            });

            return;
        }

        const result = await queryHandler.handle(playlist);

        if (!result) {
            await interaction.editReply({
                content: 'Link no longer valid!',
            });
        }

        const voiceConnection =
            getVoiceConnection(interaction.guildId!) ||
            joinVoiceChannel({
                channelId: voiceChannel,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild?.voiceAdapterCreator!,
            });

        interaction.editReply({
            content: `Loading ${name}`,
        });

        const played = await PlayManager.enqueueAudio(result, voiceConnection);

        if (played?.action === 'play') {
            interaction.editReply({
                content: `Playing ${name}`,
            });
        } else {
            interaction.editReply({
                content: `Added ${name} to queue`,
            });
        }

        return;
    }
}

export default LoadCommand;
