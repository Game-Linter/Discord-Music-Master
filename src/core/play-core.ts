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

import axios from 'axios';
import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import ytdl, { getInfo } from 'ytdl-core-discord';
// import {} from './get-data-youtube';
import ytsr from 'ytsr';
import { getSpotifyTrack } from '../utils/get-spotify-track';
import { getAccessToken } from '../utils/get-token';
import { DiscordServer } from './discordServer';
import { getData, SPOTIFY_URI } from './get-data-youtube';

export const getRecommended = async (tmpUrl: string) => {
    let itemId = tmpUrl.split('/')[4];
    if (itemId.indexOf('?') !== -1) {
        itemId = itemId.slice(0, itemId.indexOf('?'));
    }

    const Link = await axios
        .get(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${itemId}&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                },
            },
        )
        .then((res) => {
            return res.data.tracks[0].external_urls.spotify as string;
        });
    return {
        spotifyLink: Link,
    };
};

export const getTitleYoutube = async (link: string) => {
    return (
        link && (await getInfo(link).then((info) => info.videoDetails.title))
    );
};

export async function play(
    connection: VoiceConnection,
    queue: string[],
    id: string,
    message: Message,
    servers: { [x: string]: DiscordServer },
    title?: string,
): Promise<StreamDispatcher | null> {
    // console.log(queue[id]);
    if (servers[id].loop) {
        const trackUrl = servers[id].loop as string;
        let searchUri: any, finalTitle: any;

        if (trackUrl.startsWith(SPOTIFY_URI)) {
            const { search, title } = await getSpotifyTrack(
                await getAccessToken(),
                trackUrl,
            );
            searchUri = search;
            finalTitle = title;
        }
        const { url, title } = searchUri
            ? await ytsr(searchUri, { pages: 1, limit: 1 }).then(
                  (res) => res.items[0] as any,
              )
            : await getData(trackUrl, message);
        message.react('🔁');
        message.channel.send(`Now playing | ${finalTitle || title}`);
        return connection
            ?.play(
                await ytdl(url as string, {
                    filter: 'audioonly',
                }),
                {
                    type: 'opus',
                },
            )
            .on('finish', () => {
                (async () => {
                    servers[id].setDispatcher = (await play(
                        connection,
                        queue,
                        id,
                        message,
                        servers,
                    )) as StreamDispatcher;
                })();
            });
    }
    // console.log(connection[id]);
    // servers[id].setQueue = queue;
    if (queue.length) {
        servers[id].setQueue = queue;
        const [firstUrl] = queue;
        // console.log(queue.length, firstUrl);
        if (firstUrl.startsWith(SPOTIFY_URI)) {
            try {
                const { search, title } = await getSpotifyTrack(
                    await getAccessToken(),
                    firstUrl,
                );
                title && await message.react('😳');
                title && await message.channel.send(`Now playing | ${title}`);
                const { url } = await ytsr(search, { pages: 1, limit: 1 })
                    .then((__res) => __res.items[0] as any)
                    .catch((err) => {
                        console.log(err.message);
                        return {
                            url: null,
                        };
                    });
                return connection
                    ?.play(
                        await ytdl(url, {
                            filter: 'audioonly',
                        }),
                        {
                            type: 'opus',
                        },
                    )
                    .on('finish', () => {
                        if (servers[id]?.autoplay) {
                            servers[id].setAuto = firstUrl;
                        }
                        // queue.shift();
                        const [, ...tmpQueue] = queue;
                        console.log(tmpQueue.length);
                        // tmpQueue.shift();
                        servers[id].setQueue = tmpQueue;
                        (async () => {
                            servers[id].setDispatcher = (await play(
                                connection,
                                tmpQueue,
                                id,
                                message,
                                servers,
                                title,
                            )) as StreamDispatcher;
                        })();
                    });
            } catch (error) {
                console.log(error.message);
                queue.shift();
                const { search, title } = await getSpotifyTrack(
                    await getAccessToken(),
                    queue[0],
                );
                title && message.react('😳');
                title && message.channel.send(`Now playing | ${title}`);
                const { url } = await ytsr(search, { pages: 1, limit: 1 })
                    .then((__res) => __res.items[0] as any)
                    .catch((err) => {
                        console.log(error.message);

                        return { url: null };
                    });
                return connection
                    ?.play(
                        await ytdl(url, {
                            filter: 'audioonly',
                        }),
                        {
                            type: 'opus',
                        },
                    )
                    .on('finish', () => {
                        if (servers[id].autoplay) {
                            servers[id].setAuto = queue[0];
                        }
                        // queue.shift();
                        const [x, ...tmpQueue] = queue;
                        servers[id].setQueue = tmpQueue;
                        (async () => {
                            servers[id].setDispatcher = (await play(
                                connection,
                                tmpQueue,
                                id,
                                message,
                                servers,
                                title,
                            )) as StreamDispatcher;
                        })();
                    });
            }
        }
        const title = await getTitleYoutube(queue[0]);
        title && await message.react('😳');
        title && await message.channel.send(`Now playing | ${title}`);
        return connection
            ?.play(
                await ytdl(queue[0], {
                    filter: 'audioonly',
                }),
                {
                    type: 'opus',
                },
            )
            .on('finish', () => {
                const [firstUrl, ...tmpQueue] = queue;
                servers[id].setQueue = tmpQueue;

                if (servers[id].autoplay) {
                    servers[id].setAuto = firstUrl;
                }
                // queue.shift();
                (async () => {
                    servers[id].setDispatcher = (await play(
                        connection,
                        tmpQueue,
                        id,
                        message,
                        servers,
                        title,
                    )) as StreamDispatcher;
                })();
            });
    }

    if (servers[id].autoplay) {
        // console.log(id, autoplay[id]);
        const qq = servers[id].autoplay as string;
        // console.log(qq);

        let tmpQ = [];

        if (qq.startsWith(SPOTIFY_URI)) {
            const { spotifyLink } = await getRecommended(qq);
            console.log('Used spotify recommendation');
            servers[id].setAuto = spotifyLink;
            tmpQ = queue;
            tmpQ.push(spotifyLink);
        } else {
            const { video_url } = await getInfo(
                servers[id].autoplay as string,
            ).then(async (info) => {
                const videoId = info.related_videos[
                    Math.floor(Math.random() * 2)
                ].id as string;
                return await getInfo(videoId).then(
                    (_info) => _info.videoDetails,
                );
            });
            servers[id].setAuto = video_url;
            tmpQ = queue;
            tmpQ.push(video_url);
        }
        return (await play(
            connection,
            tmpQ,
            id,
            message,
            servers,
        )) as StreamDispatcher;
    }

    servers[id].getConnection?.disconnect();
    delete servers[id];
    return null;
}
