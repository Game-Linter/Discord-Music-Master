import { AxiosInstance } from 'axios';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import SpotifyApiWrapper from '../SpotifyApiWrapper';
import { ItemHandler } from './ItemHandler.abstract';

export class PlaylistHandler extends ItemHandler {
    public async handleItem(itemId: string) {
        const token = await getCachedSpotifyToken();

        return SpotifyApiWrapper.getPlaylist(itemId);
    }
}
