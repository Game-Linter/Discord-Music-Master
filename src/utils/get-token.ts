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


import qs from 'qs';
import { promisify } from 'util';
import { BASE } from '../config/base-spotify.config';
import { redisClient } from '../core/redis.server';
import { tokenAx } from './axios-instance';

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
        aatoken = await tokenAx
            .post(
                '/api/token',
                qs.stringify({
                    grant_type: 'client_credentials',
                }),
                {
                    headers: {
                        Authorization: `Basic ${BASE}`,
                    },
                },
            )
            .then((_res) => {
                (async () => {
                    try {
                        await setAsync(
                            'redis:token',
                            3590,
                            _res.data.access_token,
                        );
                    } catch (error) {
                        console.log(error.message);
                    }
                })();
                return _res.data.access_token;
            });
    }
    return aatoken;
};
