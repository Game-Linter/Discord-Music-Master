import axios from 'axios';

export const getSpotifyTrack: (
	token: string,
	url: string
) => Promise<{ search: string; title: string }> = async (
	token: string,
	url: string
) => {
	let itemId = url.split('/')[4];
	if (itemId.indexOf('?') !== -1) {
		itemId = itemId.slice(0, itemId.indexOf('?'));
	}
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
			console.log(err.message);

			return {
				search: '',
				title: '',
			};
		});
};
