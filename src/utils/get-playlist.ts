import axios from 'axios';

export const getPlaylistSpotify = async (
	type: string,
	itemId: string,
	aatoken: string
) => {
	return await axios
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
};
