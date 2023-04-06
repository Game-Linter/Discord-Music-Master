import { SpotifyItemHandler } from '../../abstract/ItemHandler.abstract';
import { ResultUrl } from '../../abstract/UrlHandler';
import SpotifyApiWrapper from '../SpotifyApiWrapper';

export class AlbumHandler extends SpotifyItemHandler {
    public async handleItem(
        item: string,
    ): Promise<ResultUrl | ResultUrl[] | null> {
        return SpotifyApiWrapper.getAlbum(item);
    }
}
