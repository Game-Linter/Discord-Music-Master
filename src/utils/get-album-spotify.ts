import { ax } from './axios-instance';

export const getAlbumSpotify = async (
    type: string,
    itemId: string,
    aatoken: string,
) => {
    return await ax
        .get(`/${type}s/${itemId}/tracks`, {
            headers: {
                Authorization: `Bearer ${aatoken}`,
            },
            params: {
                limit: 50,
            },
        })
        .then((res) => {
            const items: { external_urls: { spotify: string } }[] =
                res.data.items;

            return items.map((item) => {
                return item.external_urls.spotify;
            });
        });
};
