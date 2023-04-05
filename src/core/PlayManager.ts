import { AudioPlayer } from '@discordjs/voice';
import { ConnectionState } from './ConnectionState';

type GuildId = string;

class PlayManager {
    private players = new Map<GuildId, ConnectionState>();

    public getConnectionState(guildId: string) {
        return this.players.get(guildId);
    }

    public createConnectionState(guildId: GuildId, player: AudioPlayer) {
        const connectionState = new ConnectionState(player);

        this.players.set(guildId, connectionState);

        return connectionState;
    }

    public hasConnectionState(guildId: GuildId) {
        return this.players.has(guildId);
    }

    public deleteConnectionState(guildId: GuildId) {
        return this.players.delete(guildId);
    }

    public next(guildId: GuildId) {
        if (!this.hasConnectionState(guildId)) return;

        const connectionState = this.players.get(guildId) as ConnectionState;

        if (!connectionState.hasNext()) return;

        connectionState.shiftQueue();

        const nextTrack = connectionState.currentTrack;

        return nextTrack;
    }
}

export default new PlayManager();
