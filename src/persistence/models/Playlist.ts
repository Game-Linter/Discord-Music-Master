import { RedisPersistable } from './RedisPersistence.abstract';

export type Playlist = Map<string, string>;

export class GuildPlaylist extends RedisPersistable<Playlist> {
    protected _dbKey: string;
    protected TTL = undefined;

    constructor(id: string) {
        super();
        this._dbKey = `redis:playlist:${id}`;
    }
}
