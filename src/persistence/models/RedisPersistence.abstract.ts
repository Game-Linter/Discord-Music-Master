import { getAsync, setAsync, setPersist } from '../redis.server';

export abstract class RedisPersistable<T> {
    protected abstract _dbKey: string;
    private _value!: T;

    private static readonly _dbKeyPrefix = 'redis:playlist:';

    protected abstract TTL: number | undefined;

    public static async get<T>(key: string): Promise<T | null> {
        const value = await getAsync(`${this._dbKeyPrefix}${key}`);

        if (!value) return null;

        if (typeof value === 'string') {
            try {
                const parsedValue = JSON.parse(value) as T;

                console.log(
                    parsedValue,
                    typeof parsedValue,
                    parsedValue instanceof Object,
                );
                if (
                    typeof parsedValue === 'object' &&
                    parsedValue !== null &&
                    parsedValue instanceof Object
                ) {
                    try {
                        return new Map(parsedValue as any) as T;
                    } catch (error) {
                        return parsedValue;
                    }
                } else {
                    return parsedValue;
                }
            } catch (error) {
                return value as unknown as T;
            }
        } else {
            return value as unknown as T;
        }
    }

    get value() {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
    }

    get dbKey() {
        return this._dbKey;
    }

    set dbKey(key: string) {
        this._dbKey = key;
    }

    async get(): Promise<T | null> {
        const value = await getAsync(this._dbKey);

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

    private async setex(value: T, ttl: number) {
        if (typeof value === 'string') {
            await setAsync(this._dbKey, ttl, value);
        } else {
            await setAsync(this._dbKey, ttl, JSON.stringify(value));
        }
    }

    private async setPersist(value: T) {
        if (typeof value === 'string') {
            await setPersist(this._dbKey, value);
        } else {
            if (value instanceof Map) {
                await setPersist(
                    this._dbKey,
                    JSON.stringify(Array.from(value)),
                );
            } else {
                await setPersist(this._dbKey, JSON.stringify(value));
            }
        }
    }

    public async save() {
        if (this.TTL) {
            await this.setex(this.value, this.TTL);
        } else {
            await this.setPersist(this.value);
        }
    }
}
