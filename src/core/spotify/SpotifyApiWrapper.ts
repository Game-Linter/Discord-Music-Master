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
}

export default new SpotifyApiWrapper();
