import { getAsync, setAsync } from '../redis.server';

export abstract class RedisPersistable<T> {
    protected abstract dbKey: string;
    protected abstract TTL: number;

    async get(): Promise<T | null> {
        const value = (await getAsync(this.dbKey)) as T | null;

        return value;
    }

    async set(value: string) {
        await setAsync(this.dbKey, this.TTL, value);
    }
}
