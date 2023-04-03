import { getAsync, setAsync } from '../redis.server';
import { RedisPersistable } from './RedisPersistence.abstract';

export class SpotifyToken extends RedisPersistable {
    protected dbKey = 'redis:token';
    protected TTL = 3590 as const;

    async getToken() {
        const token = await getAsync(this.dbKey);

        return token;
    }

    async setToken(token: string) {
        await setAsync(this.dbKey, this.TTL, token);
    }
}

export default new SpotifyToken();
