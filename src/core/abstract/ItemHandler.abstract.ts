import { ResultUrl } from './UrlHandler';

export abstract class SpotifyItemHandler {
    public abstract handleItem(
        item: string,
    ): Promise<ResultUrl | ResultUrl[] | null>;
}
