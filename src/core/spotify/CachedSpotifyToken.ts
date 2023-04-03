import SpotifyAccountWrapper from './SpotifyAccountWrapper';
import SpotifyToken from '../../persistence/models/SpotifyToken';

export const getCachedSpotifyToken = async () => {
    const token = SpotifyToken.getToken();

    if (token) {
        return token;
    }

    SpotifyToken.setToken(token).then((_) => console.log('Hydrated token'));

    return await SpotifyAccountWrapper.requestToken();
};
