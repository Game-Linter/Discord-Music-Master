import axios from 'axios';
import qs from 'qs';

import { promisify } from 'util';
import { redisClient } from '../core/redis.server';
import { BASE } from '../config/base-spotify.config';
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.setex).bind(redisClient);

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
						await setAsync('redis:token', 3590, _res.data.access_token);
					} catch (error) {
						console.log(error.message);
					}
				})();
				return _res.data.access_token;
			});
	}
	return aatoken;
};
