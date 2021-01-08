import validator from 'validator';
import { Message } from 'discord.js';
import { getInfo } from 'ytdl-core-discord';
import ytsr from 'ytsr';
import axios from 'axios';
import qs from 'qs';
import { BASE } from '../config/base-spotify.config';
import { redisClient } from '../core/redis.server';
export const SPOTIFY_URI = 'https://open.spotify.com';

type TGetType = (
	urlOrQuery: string,
	message: Message
) => Promise<{ url: string | string[]; title?: string }>;

import { promisify } from 'util';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

export const getSpotifyTrack: (
	token: string,
	url: string
) => Promise<{ search: string; title: string }> = async (
	token: string,
	url: string
) => {
	const itemId = url.split('/')[4];
	return await axios
		.get(`https://api.spotify.com/v1/tracks/${itemId}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${token}`,
			},
		})
		.then((_res) => {
			return {
				search: `${_res.data.name} ${_res.data.artists[0].name}`,
				title: _res.data.name,
			};
		})
		.catch((err) => {
			console.log(err);
			return {
				search: '',
				title: '',
			};
		});
};

export const getAccessToken = async () => {
	let aatoken: string = '';
	let findToken: string | null = null;
	try {
		findToken = await getAsync('redis:token');
	} catch (error) {
		console.log(error.message);
	}
	if (findToken) {
		aatoken = findToken;
	} else {
		aatoken = await axios
			.post(
				'https://accounts.spotify.com/api/token',
				qs.stringify({
					grant_type: 'client_credentials',
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${BASE}`,
					},
				}
			)
			.then((_res) => {
				(async () => {
					try {
						await setAsync('redis:token', 3600, _res.data.access_token);
					} catch (error) {
						console.log(error.message);
					}
				})();
				return _res.data.access_token;
			});
	}
	return aatoken;
};

export const getData: TGetType = (urlOrQuery: string, message: Message) => {
	if (validator.isURL(urlOrQuery) && urlOrQuery.startsWith(SPOTIFY_URI)) {
		return (async () => {
			try {
				// https://api.spotify.com/v1/tracks/{id}
				const type = urlOrQuery.split('/')[3];
				let itemId = urlOrQuery.split('/')[4];
				if (itemId.indexOf('?') !== -1) {
					itemId = itemId.slice(0, itemId.indexOf('?'));
				}
				const aatoken = await getAccessToken();
				return (async () => {
					switch (type) {
						case 'track':
							const trackName = await getSpotifyTrack(aatoken, urlOrQuery);
							const { url } = await ytsr(trackName.search, {
								limit: 1,
								pages: 1,
							}).then((__res) => __res.items[0] as any);
							return { url, title: trackName.title };

						// break;
						case 'playlist':
							const loading = message.channel.send('Loading playlist');
							const trackUrls: string[] = await axios
								.get(
									`https://api.spotify.com/v1/${type}s/${itemId}/tracks?fields=items(track(external_urls))`,
									{
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
											Authorization: `Bearer ${aatoken}`,
										},
									}
								)
								.then((_res) => {
									const items: {
										track: {
											external_urls: { spotify: string };
										};
									}[] = _res.data.items;

									const urls = items.map((value) => {
										return value.track.external_urls.spotify;
									});

									return urls;
								})
								.catch((err) => {
									console.log(err);
									return [''];
								});
							(await loading).edit('Playlist Loaded');
							return { url: trackUrls };

						default:
							return {
								url: '',
								title: '',
							};
						// break;
					}
				})();
			} catch (error) {
				return {
					url: '',
					title: '',
				};
			}
		})();
	}

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
