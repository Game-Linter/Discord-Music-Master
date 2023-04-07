import { SpotifyToken } from '../../persistence/models/SpotifyToken';
import SpotifyAccountWrapper from './SpotifyAccountWrapper';

export const getCachedSpotifyToken = async () => {
    const token = await new SpotifyToken().get();

    if (token) return token;

    const newToken = await SpotifyAccountWrapper.requestToken();

    try {
        const spotifyToken = new SpotifyToken();

        spotifyToken.value = newToken;

        await spotifyToken.save();

        console.log('Hydrated token');
    } catch (error) {
        console.error('Failed to hydrate token');
    }

    return newToken;
};
