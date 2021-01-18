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
 */ import { Message } from 'discord.js';
import validator from 'validator';
import { getInfo } from 'ytdl-core-discord';
import ytpl from 'ytpl';
import ytsr from 'ytsr';
import { getAlbumSpotify } from '../utils/get-album-spotify';
import { getPlaylistSpotify } from '../utils/get-playlist';
import { getSpotifyTrack } from '../utils/get-spotify-track';
import { getAccessToken } from '../utils/get-token';

export const SPOTIFY_URI = 'https://open.spotify.com';

type TGetType = (
    urlOrQuery: string,
    message: Message,
) => Promise<{ url: string | string[]; title?: string }>;

export const getData: TGetType = (urlOrQuery: string, message: Message) => {
    if (validator.isURL(urlOrQuery) && urlOrQuery.startsWith(SPOTIFY_URI)) {
        return (async () => {
            try {
                // https://api.spotify.com/v1/tracks/{id}
                let [, , , type, itemId] = urlOrQuery.split('/');
                if (itemId.indexOf('?') !== -1) {
                    itemId = itemId.slice(0, itemId.indexOf('?'));
                }
                const aatoken = await getAccessToken();
                return (async () => {
                    switch (type) {
                        case 'track':
                            const { title } = await getSpotifyTrack(
                                aatoken,
                                urlOrQuery,
                            );
                            return { url: urlOrQuery, title };

                        // break;
                        case 'playlist':
                            const loading = message.channel.send(
                                'Loading playlist',
                            );
                            const trackUrls: string[] = await getPlaylistSpotify(
                                type,
                                itemId,
                                aatoken,
                            );
                            (await loading).edit('Playlist Loaded');
                            return { url: trackUrls };

                        case 'album':
                            const albumTracks = await getAlbumSpotify(
                                type,
                                itemId,
                                aatoken,
                            );
                            return { url: albumTracks };
                        default:
                            return {
                                url: '',
                                title: '',
                            };
                        // break;
                    }
                })();
            } catch (error) {
                console.log(error.message);
                return {
                    url: '',
                    title: '',
                };
            }
        })();
    }

    if (validator.isURL(urlOrQuery) && urlOrQuery.indexOf('list=') !== -1) {
        return (async () => {
            const plId = urlOrQuery.slice(
                urlOrQuery.indexOf('list=') + 'list='.length,
            );
            const items = await ytpl(plId)
                .then((res) => {
                    return res.items.map((item) => {
                        return item.shortUrl;
                    });
                })
                .catch((err) => {
                    message.channel.send(err.message);
                    return '';
                });
            return {
                url: items,
            };
        })();
    }
    if (validator.isURL(urlOrQuery)) {
        return (async () => {
            const title = await getInfo(urlOrQuery).then(
                (info) => info.videoDetails.title,
            );
            return {
                url: urlOrQuery,
                title,
            };
        })();
    }

    return (async () => {
        const [, ...tmp] = message.content.split(' ');
        const { url, title } = await ytsr(tmp.join(' '), {
            limit: 1,
            pages: 1,
        })
            .then((res) => res.items[0] as any)
            .catch((err) => {
                console.log(err.message);
                return {
                    url: '',
                };
            });
        return {
            url,
            title,
        };
    })();
};
