import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { BASE } from '../../config/base-spotify.config';
import { HttpClient } from '../abstract/HttpWrapper';

type SpotifyResponse = {
    access_token: string;
};

class SpotifyAccountWrapper extends HttpClient {
    readonly instance = axios.create({
        baseURL: 'https://accounts.spotify.com',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    async requestToken() {
        const response = await this.instance.post<
            any,
            AxiosResponse<SpotifyResponse>
        >(
            '/api/token',
            qs.stringify({
                grant_type: 'client_credentials',
            }),
            {
                headers: {
                    Authorization: `Basic ${BASE}`,
                },
            },
        );

        return response.data.access_token;
    }
}

export default new SpotifyAccountWrapper();
