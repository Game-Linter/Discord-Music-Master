import { RedisPersistable } from './RedisPersistence.abstract';

export class SpotifyToken extends RedisPersistable<string> {
    protected readonly _dbKey = 'redis:token';
    protected readonly TTL = 3590 as const;

    constructor() {
        super();
    }
}
