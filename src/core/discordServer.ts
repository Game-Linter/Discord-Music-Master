import { Message, StreamDispatcher } from 'discord.js';
import { play } from './play-core';
import { VoiceConnection } from 'discord.js';

export class DiscordServer {
	private connection!: VoiceConnection;
	public dispatcher!: StreamDispatcher | null;
	public queue: string[] = [];
	private isAutoplay: any = true;
	private isLoop: any = false;

	constructor(
		message: Message,
		servers: { [x: string]: DiscordServer },
		id: string,
		url: string | string[],
		title?: string
	) {
		(async () => {
			try {
				this.connection = (await message.member?.voice.channel?.join()) as VoiceConnection;
				if (Array.isArray(url)) {
					this.queue.push(...url);
				} else {
					this.queue.push(url);
				}
				this.dispatcher = await play(
					this.connection,
					this.queue,
					id,
					message,
					servers,
					title
				).catch((err) => null);
			} catch (error) {
				message.channel.send(error.message);
				delete servers[id];
			}
		})();
	}

	public get loop(): boolean | string {
		return true && this.isLoop;
	}
	public get autoplay(): boolean | string {
		return true && this.isAutoplay;
	}

	public get getQueue(): string[] {
		return this.queue;
	}
	public get getConnection(): VoiceConnection {
		return this.connection;
	}

	public set setDispatcher(dispatcher: StreamDispatcher) {
		this.dispatcher = dispatcher;
	}
	public set setConnection(connection: VoiceConnection) {
		this.connection = connection;
	}

	public set setQueue(queue: any[]) {
		this.queue = queue;
	}

	public set setAuto(v: string | boolean) {
		this.isAutoplay = v;
	}
	public set setLoop(v: string | boolean) {
		this.isLoop = v;
	}
}
