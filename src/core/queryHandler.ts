import validator from 'validator';
import { ResultUrl, UrlHandler } from './abstract/UrlHandler';
import { SpotifyUrlHandler } from './spotify/SpotifyUrlHandler';

type SupportedHandlers = 'spotify';

type Handlers = {
    [key in SupportedHandlers]: {
        url: string;
        handler: UrlHandler;
    };
};

class QueryHandler {
    private handlers: Handlers = {
        spotify: {
            url: SpotifyUrlHandler.SPOTIFY_URI,
            handler: new SpotifyUrlHandler(),
        },
    };

    async handle(urlOrQuery: string): Promise<ResultUrl | ResultUrl[] | null> {
        if (validator.isURL(urlOrQuery)) {
            if (urlOrQuery.startsWith(this.handlers['spotify'].url)) {
                return await this.handlers['spotify'].handler.handleUrl(
                    urlOrQuery,
                );
            } else {
                return null;
            }
        } else {
            // handle with search

            return {
                url: '',
                title: '',
            };
        }
    }
}

export default new QueryHandler();
