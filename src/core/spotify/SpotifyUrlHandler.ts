import validator from 'validator';
import { SPOTIFY_URI } from '../Accessors';
import { ResultUrl, UrlHandler } from './UrlHandler';

export class SpotifyUrlHandler extends UrlHandler {
    private static readonly SPOTIFY_URI = 'https://open.spotify.com/' as const;

    public async handleUrl(url: string): Promise<ResultUrl | null> {
        if (!validator.isURL(url) || !url.startsWith(SPOTIFY_URI)) {
            throw new Error('Invalid Url');
        }

        const { type, itemId } = this.parseUrl(url);
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
