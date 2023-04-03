import { AxiosInstance, Method } from 'axios';

export abstract class HttpClient {
    protected abstract instance: AxiosInstance;

    protected makeRequest({
        method,
        args,
    }: {
        method: Method | string;
        args: any;
    }) {
        return this.instance.request({
            method,
            ...args,
        });
    }
}
