import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { DiscordServer } from './discordServer';
import { getInfo } from 'ytdl-core-discord';
import ytdl from 'ytdl-core-discord';
import { getData, SPOTIFY_URI } from './get-data-youtube';
// import {} from './get-data-youtube';
import ytsr from 'ytsr';
import axios from 'axios';
import { getAccessToken } from '../utils/get-token';
import { getSpotifyTrack } from '../utils/get-spotify-track';

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

export const getTitleYoutube = async (link: string) => {
	return link && (await getInfo(link).then((info) => info.videoDetails.title));
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
		const trackUrl = servers[id].loop as string;
		let searchUri: any, finalTitle: any;

		if (trackUrl.startsWith(SPOTIFY_URI)) {
			const { search, title } = await getSpotifyTrack(
				await getAccessToken(),
				trackUrl
			);
			searchUri = search;
			finalTitle = title;
		}
		const { url, title } = searchUri
			? await ytsr(searchUri, { pages: 1, limit: 1 }).then(
					(res) => res.items[0] as any
			  )
			: await getData(trackUrl, message);
		finalTitle && message.react('🔁');
		finalTitle && message.channel.send(`Now playing | ${finalTitle || title}`);
		return connection
			?.play(
				await ytdl(url as string, {
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
	// servers[id].setQueue = queue;
	if (queue.length) {
		const [firstUrl] = queue;
		if (firstUrl.startsWith(SPOTIFY_URI)) {
			try {
				const { search, title } = await getSpotifyTrack(
					await getAccessToken(),
					firstUrl
				);
				title && message.react('😳');
				title && message.channel.send(`Now playing | ${title}`);
				const { url } = await ytsr(search, { pages: 1, limit: 1 })
					.then((__res) => __res.items[0] as any)
					.catch((err) => {
						return {
							url: null,
						};
					});
				return url
					? connection
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
									servers[id].setAuto = firstUrl;
								}
								// queue.shift();
								const [, ...tmpQueue] = queue;
								// console.log(tmpQueue);
								// tmpQueue.shift();
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
							})
					: null;
			} catch (error) {
				servers[id].queue.shift();
				const { search, title } = await getSpotifyTrack(
					await getAccessToken(),
					queue[0]
				);
				title && message.react('😳');
				title && message.channel.send(`Now playing | ${title}`);
				const { url } = await ytsr(search, { pages: 1, limit: 1 })
					.then((__res) => __res.items[0] as any)
					.catch((err) => {
						return { url: null };
					});
				return url
					? connection
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
									servers[id].setAuto = queue[0];
								}
								// queue.shift();
								const [x, ...tmpQueue] = queue;
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
							})
					: null;
			}
		}
		const title = await getTitleYoutube(queue[0]);
		title && message.react('😳');
		title && message.channel.send(`Now playing | ${title}`);
		return connection
			?.play(
				await ytdl(queue[0], {
					filter: 'audioonly',
				}),
				{
					type: 'opus',
				}
			)
			.on('finish', () => {
				const [firstUrl, ...tmpQueue] = queue;

				if (servers[id].autoplay) {
					servers[id].setAuto = firstUrl;
				}
				// queue.shift();
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
			tmpQ = queue;
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
			tmpQ = queue;
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
