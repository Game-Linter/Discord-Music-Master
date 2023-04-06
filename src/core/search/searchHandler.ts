import ytsr, { Playlist, Video } from 'ytsr';

export class SearchHandler {
    async handle(query: string) {
        try {
            const result = await ytsr(query, {
                limit: 1,
                pages: 1,
            }).then((res) => res.items[0] as Video | Playlist);

            return {
                url: result.url,
                title: result.title,
            };
        } catch (error: any) {
            console.log(error.message);
            return {
                url: '',
                title: '',
            };
        }
    }
}
