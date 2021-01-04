import { Message, VoiceConnection } from 'discord.js';
import { Discord } from './core/server';
import ytdl from 'ytdl-core-discord';
import validator from 'validator';
import { getInfo } from 'ytdl-core-discord';

const PREFIX = '__';
let connection: any = {};
let dispatcher: any = {};
let loop: any = {};
let queue: any = {};

async function play(
	connection: { [x: string]: VoiceConnection },
	queue: { [x: string]: any[] },
	id: string
) {
	console.log(queue[id]);
	// console.log(connection[id]);
	if (queue[id].length) {
		return connection[id]
			?.play(
				await ytdl(queue[id][0], {
					filter: 'audioonly',
				}),
				{
					type: 'opus',
				}
			)
			.on('finish', () => {
				queue[id].shift();
				(async () => {
					dispatcher[id] = await play(connection, queue, id);
				})();
			});
	} else {
		if (!loop[id]) {
			connection[id].disconnect();
			delete connection[id];
			delete dispatcher[id];
			delete queue[id];
			delete loop[id];
			return null;
		} else {
			return connection[id]
				?.play(
					await ytdl(loop[id], {
						filter: 'audioonly',
					}),
					{
						type: 'opus',
					}
				)
				.on('finish', () => {
					queue[id].shift();
					(async () => {
						dispatcher[id] = await play(connection, queue, id);
					})();
				});
		}
	}
}

const messageHandler = (message: Message) => {
	if (message.content.startsWith(PREFIX) && !message.author.bot) {
		const content = message.content
			.split(' ')[0]
			.slice(PREFIX.length, message.content.length);
		const id = message.guild!.id;
		switch (content) {
			case 'audio':
				if (message.member?.voice.channelID) {
					(async () => {
						const args = message.content.split(' ');
						const title = await getInfo(args[1]).then(
							(info) => info.videoDetails.title
						);
						// return;
						try {
							if (!connection[id]) {
								queue[id] = [];
								queue[id].push(args[1]);
								connection[id] = await message.member?.voice.channel?.join();
								dispatcher[id] = await play(connection, queue, id);
								message.channel.send(`Now playing ${title}`);
							} else {
								queue[id].push(args[1]);
								message.channel.send(`Now playing | ${title}`);
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
				delete queue[id];
				delete dispatcher[id];
				delete loop[id];
				break;

			case 'skip':
				queue[id].shift();
				(async () => {
					dispatcher[id] = await play(connection, queue, id);
					const title = await getInfo(queue[id]).then(
						(info) => info.videoDetails.title
					);
					message.channel.send(`Now playing | ${title}`);
				})();
				break;
			case 'loop':
				loop[id] = loop[id] ? false : queue[id][0];
				break;

			default:
				break;
		}
	}
};

const client = new Discord({
	messageHandler,
});
