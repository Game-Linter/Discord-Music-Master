import { SpotifyItemHandler } from '../../abstract/ItemHandler.abstract';
import { ResultUrl } from '../../abstract/UrlHandler';
import SpotifyApiWrapper from '../SpotifyApiWrapper';

export class TrackHandler extends SpotifyItemHandler {
    public async handleItem(itemId: string): Promise<ResultUrl | null> {
        return SpotifyApiWrapper.getTrack(itemId);
    }
}
