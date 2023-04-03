import { RedisPersistable } from './RedisPersistence.abstract';

export class SpotifyPlaylist extends RedisPersistable {
    protected dbKey = 'redis:playlist';
    protected TTL = 3590 as const;

    async getPlaylist() {
        const playlist = await getAsync(this.dbKey);

        return playlist;
    }

    async setPlaylist(playlist: string) {
        await setAsync(this.dbKey, this.TTL, playlist);
    }
}
