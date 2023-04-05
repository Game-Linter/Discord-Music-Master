import { ResultUrl, UrlHandler } from './abstract/UrlHandler';
import { SearchHandler } from './search/searchHandler';
import { SpotifyUrlHandler } from './spotify/SpotifyUrlHandler';
import { YoutubeHandler } from './youtube/YoutubeHandler';

enum SupportedHandlers {
    Spotify = 'spotify',
    Youtube = 'youtube',
}

type Handler = {
    prefixUrl: string;
    handler: UrlHandler;
};

type Handlers = {
    [key in SupportedHandlers]: Handler;
};

export type Result = ResultUrl | ResultUrl[] | null;

class QueryHandler {
    private handlers: Handlers = {
        [SupportedHandlers.Spotify]: {
            prefixUrl: SpotifyUrlHandler.SPOTIFY_URI,
            handler: new SpotifyUrlHandler(),
        },
        [SupportedHandlers.Youtube]: {
            prefixUrl: YoutubeHandler.YOUTUBE_URI,
            handler: new YoutubeHandler(),
        },
    };

    private defaultHandler = new SearchHandler();

    async handle(urlOrQuery: string): Promise<Result> {
        let result: Promise<Result> = Promise.resolve(null);

        const Handler = Object.values(this.handlers).find(
            ({ prefixUrl: url }) => urlOrQuery.startsWith(url),
        );

        if (!Handler) {
            result = this.defaultHandler.handle(urlOrQuery);
        } else {
            result = Handler.handler.handleUrl(urlOrQuery);
        }

        result = this.enrichResult(result);

        return result;
    }

    private async enrichResult(result: Promise<Result>): Promise<Result> {
        return this.enrichTitle(this.enrichUrl(result));
    }

    private async enrichUrl(result: Promise<Result>) {
        const newResult = await result;

        if (!newResult) return null;

        if (Array.isArray(newResult)) {
            const enrichedResult = [];

            for (const item of newResult) {
                if (item.title) {
                    enrichedResult.push({
                        title: item.title,
                        url:
                            item.url ||
                            (await this.defaultHandler.handle(item.title)).url,
                    });
                }
            }

            return enrichedResult;
        } else {
            if (newResult.title) {
                return {
                    title: newResult.title,
                    url:
                        newResult.url ||
                        (await (
                            await this.defaultHandler.handle(newResult.title)
                        ).url),
                };
            }

            return newResult;
        }
    }

    private async enrichTitle(result: Promise<Result>) {
        // ! TODO : fix title enricher

        const newResult = await result;

        if (!newResult) return null;

        if (Array.isArray(newResult)) {
            const enrichedResult = [];

            for (const item of newResult) {
                if (item.url) {
                    enrichedResult.push({
                        title: item.title,
                        url: item.url,
                    });
                }
            }

            return enrichedResult;
        } else {
            if (newResult.title) {
                return {
                    title: newResult.title,
                    url: newResult.url,
                };
            }

            return newResult;
        }
    }
}

export default new QueryHandler();
