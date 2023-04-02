import axios from 'axios';
import qs from 'qs';
import { BASE } from '../../config/base-spotify.config';

export const SpotifsyHttpClient = axios.create({
    baseURL: 'https://accounts.spotify.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

type SpotifyResponse = {
    access_token: string;
};

export class SpotifyHttpClient {
    private instance = axios.create({
        baseURL: 'https://accounts.spotify.com',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    async requestToken() {
        const response = this.instance.post(
            '/api/token',
            qs.stringify({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    Authorization: `Basic ${BASE}`,
                },
            },
        ) as unknown as SpotifyResponse;

        return response.access_token;
    }
}
