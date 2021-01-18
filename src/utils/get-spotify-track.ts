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

export const getSpotifyTrack: (
    token: string,
    url: string,
) => Promise<{ search: string; title: string }> = async (
    token: string,
    url: string,
) => {
    let itemId = url.split('/')[4];
    if (itemId.indexOf('?') !== -1) {
        itemId = itemId.slice(0, itemId.indexOf('?'));
    }
    return await ax
        .get(`/tracks/${itemId}`, {
            headers: {
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
