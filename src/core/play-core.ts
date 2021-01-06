import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { DiscordServer } from './discordServer';
import { getInfo } from 'ytdl-core-discord';
import ytdl from 'ytdl-core-discord';

export async function play(
	connection: VoiceConnection,
	queue: string[],
	id: string,
	message: Message,
	servers: { [x: string]: DiscordServer },
	title?: string
): Promise<StreamDispatcher | null> {
	// console.log(queue[id]);
	if (servers[id].loop) {
		const title =
			servers[id].loop &&
			(await getInfo(servers[id].loop as string).then(
				(info) => info.videoDetails.title
			));
		title && message.react('🔁');
		title && message.channel.send(`Now playing | ${title}`);
		return connection
			?.play(
				await ytdl(servers[id].loop as string, {
					filter: 'audioonly',
				}),
				{
					type: 'opus',
				}
			)
			.on('finish', () => {
				(async () => {
					servers[id].setDispatcher = (await play(
						connection,
						queue,
						id,
						message,
						servers
					)) as StreamDispatcher;
				})();
			});
	}
	// console.log(connection[id]);
	if (servers[id].getQueue.length) {
		console.log(servers[id].getQueue);
		if (title) {
			message.channel.send(`Now playing | ${title}`);
		} else {
			const title =
				servers[id].getQueue[0] &&
				(await getInfo(servers[id].getQueue[0]).then(
					(info) => info.videoDetails.title
				));
			title && message.react('😳');
			title && message.channel.send(`Now playing | ${title}`);
		}
		return connection
			?.play(
				await ytdl(servers[id].getQueue[0], {
					filter: 'audioonly',
				}),
				{
					type: 'opus',
				}
			)
			.on('finish', () => {
				if (servers[id].autoplay) {
					servers[id].setAuto = servers[id].getQueue[0];
				}
				// servers[id].getQueue.shift();
				const tmpQueue = servers[id].getQueue;
				tmpQueue.shift();
				(async () => {
					servers[id].setDispatcher = (await play(
						connection,
						tmpQueue,
						id,
						message,
						servers,
						title
					)) as StreamDispatcher;
				})();
			});
	}

	if (servers[id].autoplay) {
		// console.log(id, autoplay[id]);
		const { video_url } = await getInfo(servers[id].autoplay as string).then(
			async (info) => {
				const videoId = info.related_videos[Math.floor(Math.random() * 2)]
					.id as string;
				return await getInfo(videoId).then((_info) => _info.videoDetails);
			}
		);
		// title && message.channel.send(`Now playing | ${title}`);
		servers[id].setAuto = video_url;
		const tmpQ = servers[id].getQueue;
		tmpQ.push(video_url);
		return (await play(
			connection,
			tmpQ,
			id,
			message,
			servers
		)) as StreamDispatcher;
	}

	servers[id].getConnection?.disconnect();
	delete servers[id];
	return null;
}
