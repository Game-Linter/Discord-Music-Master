import { Message, VoiceConnection, StreamDispatcher } from 'discord.js';
import { Discord } from './core/server';
import ytdl from 'ytdl-core-discord';
import validator from 'validator';
import { getInfo } from 'ytdl-core-discord';
import ytsr from 'ytsr';

const PREFIX = '__';
let connection: { [x: string]: any } = {};
let dispatcher: { [x: string]: StreamDispatcher | null } = {};
let loop: { [x: string]: string | boolean } = {};
let queue: { [x: string]: string[] } = {};
let autoplay: { [x: string]: boolean | string } = {};

async function play(
	connection: { [x: string]: VoiceConnection },
	queue: { [x: string]: any },
	id: string,
	message: Message
) {
	// console.log(queue[id]);
	// console.log(connection[id]);
	if (queue[id].length) {
		const title =
			queue[id] &&
			(await getInfo(queue[id][0]).then((info) => info.videoDetails.title));
		title && message.react('😳');
		title && message.channel.send(`Now playing | ${title}`);
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
					dispatcher[id] = await play(connection, queue, id, message);
				})();
			});
	} else {
		if (autoplay[id]) {
			console.log(id, autoplay[id]);
			const { title, video_url } = await getInfo(autoplay[id] as string).then(
				async (info) => {
					const videoId = info.related_videos[Math.floor(Math.random() * 2)]
						.id as string;
					return await getInfo(videoId).then((_info) => _info.videoDetails);
				}
			);
			title && message.channel.send(`Now playing | ${title}`);
			autoplay[id] = video_url;
			return connection[id]
				?.play(
					await ytdl(video_url as string, {
						filter: 'audioonly',
					}),
					{
						type: 'opus',
					}
				)
				.on('finish', () => {
					(async () => {
						dispatcher[id] = await play(connection, queue, id, message);
					})();
				});
		}
		if (!loop[id]) {
			connection[id].disconnect();
			delete connection[id];
			delete dispatcher[id];
			delete queue[id];
			delete loop[id];
			return null;
		}

		const title =
			loop[id] &&
			(await getInfo(loop[id] as string).then(
				(info) => info.videoDetails.title
			));
		title && message.react('🔁');
		title && message.channel.send(`Now playing | ${title}`);
		return connection[id]
			?.play(
				await ytdl(loop[id] as string, {
					filter: 'audioonly',
				}),
				{
					type: 'opus',
				}
			)
			.on('finish', () => {
				(async () => {
					dispatcher[id] = await play(connection, queue, id, message);
				})();
			});
	}
}

const getData = (urlOrQuery: string, message: Message) => {
	if (validator.isURL(urlOrQuery)) {
		return (async () => {
			const title = await getInfo(urlOrQuery).then(
				(info) => info.videoDetails.title
			);
			return {
				url: urlOrQuery,
				title,
			};
		})();
	}

	return (async () => {
		const tmp = message.content.split(' ');
		tmp.shift();
		const { url, title } = await ytsr(tmp.join(' '), {
			limit: 1,
			pages: 1,
		}).then((res) => res.items[0] as any);
		return {
			url,
			title,
		};
	})();
};

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
						if (!args[1]) {
							return message.channel.send('Give a link or a youtube search');
						}
						// return;
						const { url, title } = await getData(args[1], message);
						try {
							if (!connection[id]) {
								queue[id] = [];
								autoplay[id] = false;
								queue[id].push(url);
								connection[id] = await message.member?.voice.channel?.join();
								dispatcher[id] = await play(connection, queue, id, message);
							} else {
								queue[id].push(url);
								message.react('🦆');
								message.channel.send(`Queued | ${title}`);
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
				message.react('⏸');
				dispatcher[id]?.pause();
				break;
			case 'resume':
				message.react('⏯');
				dispatcher[id]?.resume();
				break;

			case 'fuckoff':
				message.react('🙋‍♂️');
				connection[id]?.disconnect();
				delete connection[id];
				delete queue[id];
				delete dispatcher[id];
				delete loop[id];
				delete autoplay[id];
				break;

			case 'skip':
				queue[id].shift();
				(async () => {
					dispatcher[id] = await play(connection, queue, id, message);
				})();
				break;
			case 'loop':
				loop[id] = loop[id] ? false : queue[id][0];
				message.react('♾');
				loop[id] &&
					(async () => {
						const { title } = await getInfo(loop[id] as string).then(
							(res) => res.videoDetails
						);
						message.channel.send(`Now looping forever | ${title}`);
					})();
				break;
			case 'autoplay':
				autoplay[id] = queue[id][0];
				console.log(id, autoplay[id]);
				break;

			default:
				break;
		}
	}
};

const client = new Discord({
	messageHandler,
});
