import SpotifyToken from '../../persistence/models/SpotifyToken';
import SpotifyAccountWrapper from './SpotifyAccountWrapper';

export const getCachedSpotifyToken = async () => {
    const token = await SpotifyToken.getToken();

    if (token) return token;

    const newToken = await SpotifyAccountWrapper.requestToken();

    SpotifyToken.setToken(newToken).then((_) => console.log('Hydrated token'));

    return newToken;
};
