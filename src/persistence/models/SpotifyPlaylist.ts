import { RedisPersistable } from './RedisPersistence.abstract';

type Playlist = {
    url: string;
}[];

export class SpotifyPlaylist extends RedisPersistable<Playlist> {
    protected dbKey = 'redis:playlist';
    protected TTL = 3590 as const;

    async getPlaylist() {
        const playlist = await this.get();

        return playlist;
    }

    async setPlaylist(playlist: Playlist) {
        await this.set(playlist);
    }
}
