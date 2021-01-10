import axios from 'axios';

export const ax = axios.create({
	baseURL: 'https://api.spotify.com/v1',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
});

export const tokenAx = axios.create({
	baseURL: 'https://accounts.spotify.com',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
});
