/*
 *    Copyright (C) 2021 Mohamed Belkamel
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published
 *   by the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

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
