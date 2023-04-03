export interface ResultUrl {
    url?: string;
    title?: string;
}

export abstract class UrlHandler {
    public abstract handleUrl(
        url: string,
    ): Promise<ResultUrl | ResultUrl[] | null>;
}
