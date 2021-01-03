import { Message } from 'discord.js';
import { Discord } from './core/server';
import ytdl from 'ytdl-core-discord';

const PREFIX = '__';
let connection: any = {};
let dispatcher: any = {};
let loop: any = {};

let queue: any = {};

async function play(
	connection: any,
	queue: { [x: string]: any[] },
	id: string
) {
	console.log(queue[id]);
	// console.log(connection[id]);
	if (queue[id].length) {
		return connection[id]?.play(
			await ytdl(queue[id][0], {
				filter: 'audioonly',
			}),
			{
				type: 'opus',
			}
		);
	} else {
		if (loop[id]) {
			return connection[id]?.play();
		} else {
			connection[id].disconnect();
			delete connection[id];
			return null;
		}
	}
}

const messageHandler = (message: Message) => {
	if (message.content.startsWith(PREFIX)) {
		const content = message.content
			.split(' ')[0]
			.slice(PREFIX.length, message.content.length);
		const id = message.guild!.id;
		switch (content) {
			case 'audio':
				if (message.member?.voice.channelID) {
					(async () => {
						const args = message.content.split(' ');
						try {
							if (!connection[id]) {
								queue[id] = [];
								queue[id].push(args[1]);
								connection[id] = await message.member?.voice.channel?.join();
								dispatcher[id] = await play(connection, queue, id);
								dispatcher[id].on('finish', () => {
									queue[id].shift();
									(async () => {
										await play(connection, queue, id);
									})();
								});
							} else {
								queue[id].push(args[1]);
							}
							// console.log(connection);
						} catch (error) {
							console.log(error.message);
						}
					})();
				} else {
					message.channel.send('Connect to a channel first');
				}
				break;
			case 'pause':
				dispatcher[id]?.pause();
				break;
			case 'resume':
				dispatcher[id]?.resume();
				break;

			case 'fuckoff':
				connection[id]?.disconnect();
				delete connection[id];
				break;

			case 'skip':
				queue[id].shift();
				(async () => {
					await play(connection, queue, id);
				})();
				break;
			case 'loop':
				loop[id] = true;
				break;

			default:
				break;
		}
	}
};

const client = new Discord({
	messageHandler,
});
