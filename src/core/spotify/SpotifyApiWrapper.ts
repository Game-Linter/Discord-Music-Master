import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { BASE } from '../../config/base-spotify.config';
import { getCachedSpotifyToken } from './CachedSpotifyToken';
import { HttpClient } from './HttpWrapper';

export const SpotifsyHttpClient = axios.create({
    baseURL: 'https://api.spotify.com/v1',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

export type SpotifyResponse = {
    name: string;
    artists: {
        name: string;
    }[];
};

class SpotifyApiWrapper extends HttpClient {
    readonly instance = axios.create({
        baseURL: 'https://api.spotify.com/v1',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    async getTrack(itemId: string) {
        const token = await getCachedSpotifyToken();

        const result = await this.instance.get<
            any,
            AxiosResponse<SpotifyResponse>
        >(`/tracks/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return {
            title: `${result.data.name} - ${result.data.artists[0].name}`,
        };
    }

    async getPlaylist(itemId: string) {
        const token = await getCachedSpotifyToken();

        const response = await this.instance
            .get(`/playlists/${itemId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    fields: 'items(track(external_urls))',
                },
            })
            .then((_res) => {
                const items: {
                    track: {
                        external_urls: { spotify: string };
                    };
                }[] = _res.data.items;

                const urls = items.map((value) => {
                    return value.track.external_urls.spotify;
                });

                return urls;
            });

        return response.map((url) => {
            return {
                url,
            };
        });
    }

    async getAlbum(itemId: string) {
        const token = await getCachedSpotifyToken();

        const response = await this.instance
            .get(`/albums/${itemId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    limit: 50,
                },
            })
            .then((res) => {
                const items: { external_urls: { spotify: string } }[] =
                    res.data.items;

                return items.map((item) => {
                    return item.external_urls.spotify;
                });
            });

        return response.map((url) => {
            return {
                url,
            };
        });
    }
}

export default new SpotifyApiWrapper();
