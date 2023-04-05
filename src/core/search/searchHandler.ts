import ytsr from 'ytsr';

export class SearchHandler {
    async handle(query: string) {
        try {
            const { url, title } = await ytsr(query, {
                limit: 1,
                pages: 1,
            }).then((res) => res.items[0] as any);

            return {
                url,
                title,
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
