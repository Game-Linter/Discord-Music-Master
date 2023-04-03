import { AxiosInstance } from 'axios';
import { ResultUrl } from '../../abstract/UrlHandler';

export abstract class ItemHandler {
    public abstract handleItem(
        item: string,
    ): Promise<ResultUrl | ResultUrl[] | null>;
}
