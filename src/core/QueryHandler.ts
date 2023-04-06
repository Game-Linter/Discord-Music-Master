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

    private getHandler(urlOrQuery: string) {
        const Handler = Object.values(this.handlers).find(
            ({ prefixUrl: url }) => urlOrQuery.startsWith(url),
        );

        return Handler;
    }

    async handle(urlOrQuery: string): Promise<Result> {
        let result: Promise<Result> = Promise.resolve(null);

        const Handler = this.getHandler(urlOrQuery);

        if (!Handler) {
            result = this.defaultHandler.handle(urlOrQuery);
        } else {
            result = Handler.handler.handleUrl(urlOrQuery);
        }

        result = this.enrichResult(result);

        console.log({
            result: await result,
        });
        return result;
    }

    private async enrichResult(result: Promise<Result>): Promise<Result> {
        return this.enrichTitle(this.enrichUrl(result));
    }

    private async enrichUrl(result: Promise<Result>) {
        const newResult = await result;

        if (!newResult) return null;

        if (Array.isArray(newResult)) {
            return await Promise.all(
                newResult.map(async (item) => {
                    return {
                        title: item.title,
                        url: item.title
                            ? await (
                                  await this.defaultHandler.handle(item.title)
                              ).url
                            : item.url,
                    };
                }),
            );
        } else {
            return {
                title: newResult.title,
                url: newResult.title
                    ? await (
                          await this.defaultHandler.handle(newResult.title)
                      ).url
                    : newResult.url,
            };
        }
    }

    private async enrichTitle(result: Promise<Result>) {
        // ! TODO : fix title enricher

        const newResult = await result;

        if (!newResult) return null;

        if (Array.isArray(newResult)) {
            return await Promise.all(
                newResult.map(async (item) => {
                    const handler = this.getHandler(item.url!);

                    if (item.url) {
                        const result = (await handler?.handler.handleUrl(
                            item.url!,
                        )) as ResultUrl;

                        return {
                            title: result.title,
                            url: item.url,
                        };
                    }

                    return item;
                }),
            );
        } else {
            const handler = this.getHandler(newResult.url!);

            if (newResult.url) {
                const result = (await handler?.handler.handleUrl(
                    newResult.url!,
                )) as ResultUrl;

                return {
                    title: result.title,
                    url: newResult.url,
                };
            }

            return newResult;
        }
    }
}

export default new QueryHandler();
