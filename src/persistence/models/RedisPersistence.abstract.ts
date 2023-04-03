import { getAsync, setAsync } from '../redis.server';

export abstract class RedisPersistable<T> {
    protected abstract dbKey: string;
    protected abstract TTL: number;

    async get(): Promise<T | null> {
        const value = await getAsync(this.dbKey);

        if (!value) {
            return null;
        }

        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as T;
            } catch (error) {
                return value as unknown as T;
            }
        } else {
            return value as unknown as T;
        }
    }

    async set(value: T) {
        if (typeof value === 'string') {
            await setAsync(this.dbKey, this.TTL, value);
        } else {
            await setAsync(this.dbKey, this.TTL, JSON.stringify(value));
        }
    }
}
