import { SpotifyItemHandler } from '../abstract/ItemHandler.abstract';
import { ResultUrl, UrlHandler } from '../abstract/UrlHandler';
import { AlbumHandler } from './ItemHandlers/AlbumHandler';
import { PlaylistHandler } from './ItemHandlers/PlaylistHandler';
import { TrackHandler } from './ItemHandlers/TrackHandler';

type SpotifyUrlType = 'track' | 'playlist' | 'album';

type SpotifyHandlers = {
    [key in SpotifyUrlType]: SpotifyItemHandler;
};

export class SpotifyUrlHandler extends UrlHandler {
    public static readonly SPOTIFY_URI = 'https://open.spotify.com/' as const;

    private readonly spotifyHandlers: SpotifyHandlers = {
        track: new TrackHandler(),
        playlist: new PlaylistHandler(),
        album: new AlbumHandler(),
    };

    public async handleUrl(
        url: string,
    ): Promise<ResultUrl | ResultUrl[] | null> {
        // undertand which spotify url got passed
        const { type, itemId } = this.parseUrl(url);

        const handler = this.spotifyHandlers[type as SpotifyUrlType];

        if (!handler) {
            throw new Error('Invalid Url');
        }

        return handler.handleItem(itemId);
    }

    private parseUrl(url: string) {
        let [, , , type, itemId] = url.split('/');
        if (itemId.indexOf('?') !== -1) {
            itemId = itemId.slice(0, itemId.indexOf('?'));
        }

        return {
            type,
            itemId,
        };
    }
}
