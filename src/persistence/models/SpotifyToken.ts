import { getAsync, setAsync } from '../redis.server';

export class SpotifyToken {
    private readonly dbKey = 'redis:token';
    private readonly TTL = 3590 as const;

    async getToken() {
        const token = await getAsync(this.dbKey);

        return token;
    }

    async setToken(token: string) {
        await setAsync(this.dbKey, this.TTL, token);
    }
}

export default new SpotifyToken();
