import { Message } from 'discord.js';
import validator from 'validator';
import { getInfo } from 'ytdl-core-discord';
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
