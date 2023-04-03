import { AxiosInstance } from 'axios';
import { getCachedSpotifyToken } from '../CachedSpotifyToken';
import { ItemHandler } from './ItemHandler.abstract';

export class PlaylistHandler extends ItemHandler {
    public async handleItem(itemId: string, instance: AxiosInstance) {
        const token = await getCachedSpotifyToken();

        const response = await instance
            .get(`/playlists/${itemId}/tracks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    fields: 'items(track(external_urls))',
                },
            })
            .then((_res) => {
                const items: {
                    track: {
                        external_urls: { spotify: string };
                    };
                }[] = _res.data.items;

                const urls = items.map((value) => {
                    return value.track.external_urls.spotify;
                });

                return urls;
            });

        return response.map((url) => {
            return {
                url,
            };
        });
    }
}
