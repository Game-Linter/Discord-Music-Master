import { getInfo } from 'ytdl-core-discord';
import { ResultUrl, UrlHandler } from '../abstract/UrlHandler';
import ytpl from 'ytpl';
import { Result } from '../QueryHandler';

export class YoutubeHandler extends UrlHandler {
    public static readonly YOUTUBE_URI = 'https://www.youtube.com/watch?v=';

    public async handleUrl(url: string): Promise<Result> {
        const parsedUrl = new URL(url);

        const playlistId = parsedUrl.searchParams.get('list');

        if (playlistId) {
            const playlist = await ytpl(playlistId);

            const videoList = playlist.items.map((item) => ({
                title: item.title,
                url: `${YoutubeHandler.YOUTUBE_URI}${item.id}`,
            }));

            return videoList;
        }

        const videoId = parsedUrl.searchParams.get('v');

        if (!videoId) return null;

        const video = await this.getVideoInfo(url);

        if (!video) return null;

        return {
            title: video.title,
            url,
        };
    }

    private async getVideoInfo(url: string) {
        const title = await getInfo(url).then(
            (info) => info.videoDetails.title,
        );
        return {
            title,
        };
    }
}
