import validator from 'validator';
import { ResultUrl, UrlHandler } from './abstract/UrlHandler';
import { SearchHandler } from './searchHandler';
import { SpotifyUrlHandler } from './spotify/SpotifyUrlHandler';

enum SupportedHandlers {
    Spotify = 'spotify',
    // Youtube = 'youtube',
}

type Handler = {
    prefixUrl: string;
    handler: UrlHandler;
};

type Handlers = {
    [key in SupportedHandlers]: Handler;
};

class QueryHandler {
    private handlers: Handlers = {
        [SupportedHandlers.Spotify]: {
            prefixUrl: SpotifyUrlHandler.SPOTIFY_URI,
            handler: new SpotifyUrlHandler(),
        },
    };

    private defaultHandler = new SearchHandler();

    async handle(urlOrQuery: string): Promise<ResultUrl | ResultUrl[] | null> {
        // handle with url
        const Handler = Object.values(this.handlers).find(
            ({ prefixUrl: url }) => urlOrQuery.startsWith(url),
        );

        if (!Handler) {
            return this.defaultHandler.handle(urlOrQuery);
        }

        return Handler.handler.handleUrl(urlOrQuery);
    }
}

export default new QueryHandler();
