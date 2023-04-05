import { SpotifyItemHandler } from '../../abstract/ItemHandler.abstract';
import SpotifyApiWrapper from '../SpotifyApiWrapper';

export class PlaylistHandler extends SpotifyItemHandler {
    public async handleItem(itemId: string) {
        return SpotifyApiWrapper.getPlaylist(itemId);
    }
}
