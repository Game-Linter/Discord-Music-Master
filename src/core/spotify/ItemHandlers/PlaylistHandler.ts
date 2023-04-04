import { AxiosInstance } from 'axios';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import SpotifyApiWrapper from '../SpotifyApiWrapper';
import { SpotifyItemHandler } from '../../abstract/ItemHandler.abstract';

export class PlaylistHandler extends SpotifyItemHandler {
    public async handleItem(itemId: string) {
        const token = await getCachedSpotifyToken();

        return SpotifyApiWrapper.getPlaylist(itemId);
    }
}
