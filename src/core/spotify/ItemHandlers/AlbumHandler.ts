import { AxiosInstance } from 'axios';
import { ResultUrl } from '../../abstract/UrlHandler';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import SpotifyApiWrapper from '../SpotifyApiWrapper';
import { ItemHandler } from './ItemHandler.abstract';

export class AlbumHandler extends ItemHandler {
    public async handleItem(
        item: string,
    ): Promise<ResultUrl | ResultUrl[] | null> {
        return SpotifyApiWrapper.getAlbum(item);
    }
}
