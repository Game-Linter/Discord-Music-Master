import validator from 'validator';
import { Message } from 'discord.js';
import { getInfo } from 'ytdl-core-discord';
import ytsr from 'ytsr';
import axios from 'axios';
import qs from 'qs';
import { BASE } from '../config/base-spotify.config';
import { redisClient } from '../core/redis.server';
const SPOTIFY_URI = 'https://open.spotify.com';

type TGetType = (
	urlOrQuery: string,
	message: Message
) => Promise<{ url: string | string[]; title?: string }>;

import { promisify } from 'util';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

export const getData: TGetType = (urlOrQuery: string, message: Message) => {
	if (validator.isURL(urlOrQuery) && urlOrQuery.startsWith(SPOTIFY_URI)) {
		message.channel.send('Loading playlist');
		return (async () => {
			try {
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
				// https://api.spotify.com/v1/tracks/{id}
				const type = urlOrQuery.split('/')[3];
				const itemId = urlOrQuery.split('/')[4];

				return (async () => {
					switch (type) {
						case 'track':
							const trackName: { search: string; title: string } = await axios
								.get(`https://api.spotify.com/v1/${type}s/${itemId}`, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded',
										Authorization: `Bearer ${aatoken}`,
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
							const { url } = await ytsr(trackName.search, {
								limit: 1,
								pages: 1,
							}).then((__res) => __res.items[0] as any);
							return { url, title: trackName.title };

						// break;
						case 'playlist':
							const trackNames: {
								search: string[];
								title?: string;
							} = await axios
								.get(
									`https://api.spotify.com/v1/${type}s/${itemId}/tracks?fields=items(track(name,artists))`,
									{
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
											Authorization: `Bearer ${aatoken}`,
										},
									}
								)
								.then((_res) => {
									const items: {
										track: { name: string; artists: { name: string }[] };
									}[] = _res.data.items;

									const search = items.map((value) => {
										return `${value.track.name} ${value.track.artists[0].name}`;
									});

									return {
										search: search,
									};
								})
								.catch((err) => {
									console.log(err);
									return {
										search: [''],
										title: '',
									};
								});
							let urls: string[] = [];

							for await (const iterator of trackNames.search) {
								urls.push(
									await ytsr(iterator, {
										limit: 1,
										pages: 1,
									}).then((ytsearch) => {
										const { url } = ytsearch.items[0] as any;
										return url;
									})
								);
							}
							message.channel.send('Playlist Loaded');
							return { url: urls };

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
