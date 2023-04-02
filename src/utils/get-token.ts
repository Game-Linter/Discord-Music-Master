/*
 *    Copyright (C) 2021 Mohamed Belkamel
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { Message } from 'discord.js';
import { promisify } from 'util';
import { getData } from '../core/Accessors';
import { redisClient } from '../persistence/redis.server';

export const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);
const setPlAsync = promisify(redisClient.set).bind(redisClient);

export const setBannedUser = promisify(redisClient.set).bind(redisClient);

export const setPlaylist = async (
    message: Message,
    playlistName: string,
    playlistLink: string,
) => {
    const { url } = await getData(playlistLink, message);
    if (url === '') {
        throw Error('Playlist type not supported');
    }
    let tbll = await getAsync(message.guild!.id);
    if (tbll) {
        const arr = Object.keys(JSON.parse(tbll) as { [x: string]: string });
        if (arr.includes(playlistName)) {
            throw Error('Playlist already exists by this name');
        }
        await setPlAsync(
            message.guild!.id,
            JSON.stringify({
                ...JSON.parse(tbll),
                [playlistName.trim()]: url,
            }),
        );
    } else {
        await setPlAsync(
            message.guild!.id,
            JSON.stringify({
                [playlistName.trim()]: url,
            }),
        );
    }
};

export const loadPlaylist = async (message: Message, playlistName: string) => {
    const data = await getAsync(message.guild!.id);
    if (data) {
        const jsonData: { [x: string]: string | string[] } = JSON.parse(data);
        const arr = Object.keys(jsonData);
        if (arr.includes(playlistName)) {
            return jsonData[playlistName];
        } else {
            message.channel.send(
                'No playlist found with this name, these are the playlists found:',
            );
            message.channel.send(`\`${arr.join(' | ')}\``);
            return null;
        }
    } else {
        message.channel.send('No playlist found for this server');
        return null;
    }
};
