import { AxiosInstance, AxiosResponse } from 'axios';
import { ResultUrl } from '../../abstract/UrlHandler';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import SpotifyApiWrapper, { SpotifyResponse } from '../SpotifyApiWrapper';
import { ItemHandler } from './ItemHandler.abstract';

export class TrackHandler extends ItemHandler {
    public async handleItem(itemId: string): Promise<ResultUrl | null> {
        return SpotifyApiWrapper.getTrack(itemId);
    }
}
