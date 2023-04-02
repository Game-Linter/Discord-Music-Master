import { SpotifyHttpClient } from './SpotifyHttpClient';
import SpotifyToken from './SpotifyToken';

type CachedSpotifyToken = Promise<string>;

export const getCachedSpotifyToken: () => CachedSpotifyToken = async () => {
    const token = SpotifyToken.getToken();

    if (token) {
        return token;
    }

    const httpClient = new SpotifyHttpClient();

    SpotifyToken.setToken(token).then((_) => console.log('Hydrated token'));

    return await httpClient.requestToken();
};
