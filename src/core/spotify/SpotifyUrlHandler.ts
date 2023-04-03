import validator from 'validator';
import { ResultUrl, UrlHandler } from '../abstract/UrlHandler';
import { SPOTIFY_URI } from '../Accessors';
import { ItemHandler } from './ItemHandlers/ItemHandler.abstract';
import { PlaylistHandler } from './ItemHandlers/PlaylistHandler';
import { TrackHandler } from './ItemHandlers/TrackHandler';
import SpotifyApiWrapper from './SpotifyApiWrapper';

export class SpotifyUrlHandler extends UrlHandler {
    public static readonly SPOTIFY_URI = 'https://open.spotify.com/' as const;

    private readonly spotifyHandlers: {
        [key: string]: ItemHandler;
    } = {
        track: new TrackHandler(),
        playlist: new PlaylistHandler(),
    };

    public async handleUrl(
        url: string,
    ): Promise<ResultUrl | ResultUrl[] | null> {
        if (!validator.isURL(url) || !url.startsWith(SPOTIFY_URI)) {
            throw new Error('Invalid Url');
        }

        // undertand which spotify url got passed
        const { type, itemId } = this.parseUrl(url);

        const handler = this.spotifyHandlers[type];

        if (!handler) {
            throw new Error('Invalid Url');
        }

        return handler.handleItem(itemId, SpotifyApiWrapper.instance);
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
