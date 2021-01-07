import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { DiscordServer } from './discordServer';
import { getInfo } from 'ytdl-core-discord';
import ytdl from 'ytdl-core-discord';
import { getAccessToken, SPOTIFY_URI } from './get-data-youtube';
import { getSpotifyTrack } from './get-data-youtube';
import ytsr from 'ytsr';

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
		if (servers[id].getQueue[0].startsWith(SPOTIFY_URI)) {
			const { search, title } = await getSpotifyTrack(
				await getAccessToken(),
				servers[id].getQueue[0]
			);
			title && message.react('😳');
			title &&
				message.channel.send(
					`Now playing | ${title} | Queue at: ${
						servers[id].getQueue.length - 1
					}`
				);
			const { url } = await ytsr(search, { pages: 1, limit: 1 }).then(
				(__res) => __res.items[0] as any
			);
			return connection
				?.play(
					await ytdl(url, {
						filter: 'audioonly',
					}),
					{
						type: 'opus',
					}
				)
				.on('finish', () => {
					// if (servers[id].autoplay) {
					// 	servers[id].setAuto = servers[id].getQueue[0];
					// }
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
		const title =
			servers[id].getQueue[0] &&
			(await getInfo(servers[id].getQueue[0]).then(
				(info) => info.videoDetails.title
			));
		title && message.react('😳');
		title && message.channel.send(`Now playing | ${title}`);
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
