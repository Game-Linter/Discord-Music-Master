import { getInfo } from 'ytdl-core-discord';
import { UrlHandler, ResultUrl } from '../abstract/UrlHandler';

export class YoutubeHandler extends UrlHandler {
    public static readonly YOUTUBE_URI = 'https://www.youtube.com/watch?v=';

    public async handleUrl(
        url: string,
    ): Promise<ResultUrl | ResultUrl[] | null> {
        const parsedUrl = new URL(url);
        const videoId = parsedUrl.searchParams.get('v');

        if (!videoId) return null;

        const video = await this.getVideoInfo(url);

        if (!video) return null;

        return {
            title: video.title,
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
