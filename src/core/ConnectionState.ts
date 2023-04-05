import { AudioPlayer, PlayerSubscription } from '@discordjs/voice';
import { ResultUrl } from './abstract/UrlHandler';

export class ConnectionState {
    private _currentTrack!: string;
    private _queue: string[] = [];
    private _subscription: PlayerSubscription;
    private _isAutoPlay: boolean = false;
    private _isLooping: boolean = false;
    private isPlaying: boolean = false;

    constructor(subscription: PlayerSubscription) {
        this._subscription = subscription;
    }

    public get playing() {
        return this.isPlaying;
    }

    public set playing(isPlaying: boolean) {
        this.isPlaying = isPlaying;
    }

    public get currentTrack() {
        return this._currentTrack;
    }

    public set currentTrack(track: string) {
        this._currentTrack = track;
    }

    public get queue() {
        return this._queue;
    }

    public set queue(queue: string[]) {
        this._queue = queue;
    }

    public get subscription() {
        return this._subscription;
    }
    /**
     ** default: false
     */
    public get isAutoPlay() {
        return this._isAutoPlay;
    }

    public set isAutoPlay(isAutoPlay: boolean) {
        this._isAutoPlay = isAutoPlay;
    }

    public get isLooping() {
        return this._isLooping;
    }

    public set isLooping(isLooping: boolean) {
        this._isLooping = isLooping;
    }

    public shiftQueue() {
        this._currentTrack = this._queue.shift() as string;
    }

    public pushQueue(track: Required<ResultUrl> | Required<ResultUrl>[]) {
        if (Array.isArray(track)) {
            this._queue.push(...track.map((t) => t.url));
        } else {
            this._queue.push(track.url);
        }
    }

    public hasNext() {
        const [, second] = this._queue;

        return !!second;
    }
}
