import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { DiscordServer } from './discordServer';
import { getInfo } from 'ytdl-core-discord';
import ytdl from 'ytdl-core-discord';
import { getAccessToken, SPOTIFY_URI } from './get-data-youtube';
import { getSpotifyTrack } from './get-data-youtube';
import ytsr from 'ytsr';
import axios from 'axios';

export const getRecommended = async (tmpUrl: string) => {
	let itemId = tmpUrl.split('/')[4];
	if (itemId.indexOf('?') !== -1) {
		itemId = itemId.slice(0, itemId.indexOf('?'));
	}

	const Link = await axios
		.get(
			`https://api.spotify.com/v1/recommendations?seed_tracks=${itemId}&limit=1`,
			{
				headers: {
					Authorization: `Bearer ${await getAccessToken()}`,
				},
			}
		)
		.then((res) => {
			return res.data.tracks[0].external_urls.spotify as string;
		});
	return {
		spotifyLink: Link,
	};
};

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
			try {
				const { search, title } = await getSpotifyTrack(
					await getAccessToken(),
					servers[id].getQueue[0]
				);
				title && message.react('😳');
				title && message.channel.send(`Now playing | ${title}`);
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
			} catch (error) {
				servers[id].queue.shift();
				const { search, title } = await getSpotifyTrack(
					await getAccessToken(),
					servers[id].getQueue[0]
				);
				title && message.react('😳');
				title && message.channel.send(`Now playing | ${title}`);
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
		const qq = servers[id].autoplay as string;
		// console.log(qq);

		let tmpQ = [];

		if (qq.startsWith(SPOTIFY_URI)) {
			const { spotifyLink } = await getRecommended(qq);
			console.log('Used spotify recommendation');
			servers[id].setAuto = spotifyLink;
			tmpQ = servers[id].getQueue;
			tmpQ.push(spotifyLink);
		} else {
			const { video_url } = await getInfo(servers[id].autoplay as string).then(
				async (info) => {
					const videoId = info.related_videos[Math.floor(Math.random() * 2)]
						.id as string;
					return await getInfo(videoId).then((_info) => _info.videoDetails);
				}
			);
			servers[id].setAuto = video_url;
			tmpQ = servers[id].getQueue;
			tmpQ.push(video_url);
		}
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
