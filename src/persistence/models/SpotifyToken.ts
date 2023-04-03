import { getAsync, setAsync } from '../redis.server';
import { RedisPersistable } from './RedisPersistence.abstract';

export class SpotifyToken extends RedisPersistable<String> {
    protected dbKey = 'redis:token';
    protected TTL = 3590 as const;

    async getToken() {
        const token = await this.get();

        return token;
    }

    async setToken(token: string) {
        await this.set(token);
    }
}

export default new SpotifyToken();
