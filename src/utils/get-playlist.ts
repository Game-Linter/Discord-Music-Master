import { ax } from './axios-instance';

export const getPlaylistSpotify = async (
	type: string,
	itemId: string,
	aatoken: string
) => {
	return await ax
		.get(`/${type}s/${itemId}/tracks`, {
			headers: {
				Authorization: `Bearer ${aatoken}`,
			},
			params: {
				fields: 'items(track(external_urls))',
			},
		})
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
			console.log(err.message);

			return [''];
		});
};
