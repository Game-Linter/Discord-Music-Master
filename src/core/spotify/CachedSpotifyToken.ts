import SpotifyToken from '../../persistence/models/SpotifyToken';
import SpotifyAccountWrapper from './SpotifyAccountWrapper';

export const getCachedSpotifyToken = async () => {
    const token = await SpotifyToken.getToken();

    if (token) return token;

    const newToken = await SpotifyAccountWrapper.requestToken();

    try {
        await SpotifyToken.setToken(newToken);

        console.log('Hydrated token');
    } catch (error) {
        console.error('Failed to hydrate token');
    }

    return newToken;
};
