import axios from 'axios';

export const getAlbumSpotify = async (
	type: string,
	itemId: string,
	aatoken: string
) => {
	return await axios
		.get(`https://api.spotify.com/v1/${type}s/${itemId}/tracks?limit=50`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Bearer ${aatoken}`,
			},
		})
		.then((res) => {
			const items: { external_urls: { spotify: string } }[] = res.data.items;

			return items.map((item) => {
				return item.external_urls.spotify;
			});
		});
};
