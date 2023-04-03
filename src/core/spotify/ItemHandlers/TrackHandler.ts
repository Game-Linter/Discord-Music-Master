import { AxiosInstance, AxiosResponse } from 'axios';
import { ResultUrl } from '../../abstract/UrlHandler';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import { SpotifyResponse } from '../SpotifyApiWrapper';
import { ItemHandler } from './ItemHandler.abstract';

export class TrackHandler extends ItemHandler {
    public async handleItem(
        itemId: string,
        instance: AxiosInstance,
    ): Promise<ResultUrl | null> {
        const token = await getCachedSpotifyToken();

        const result = await instance.get<any, AxiosResponse<SpotifyResponse>>(
            `/tracks/${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return {
            url: `https://open.spotify.com/track/${itemId}`,
            title: `${result.data.name} - ${result.data.artists[0].name}`,
        };
    }
}
