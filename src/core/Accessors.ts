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

import { Message } from 'discord.js';
import { parseUrl } from 'query-string';
import validator from 'validator';
import { getInfo } from 'ytdl-core';
import ytpl from 'ytpl';
import ytsr from 'ytsr';

export const SPOTIFY_URI = 'https://open.spotify.com' as const;

type TGetType = (
    urlOrQuery: string,
    message: Message,
) => Promise<{ url: string | string[]; title?: string }>;

export const getData: TGetType = (urlOrQuery: string, message: Message) => {
    if (validator.isURL(urlOrQuery) && urlOrQuery.indexOf('list=') !== -1) {
        return (async () => {
            const {
                query: { list },
            } = parseUrl(urlOrQuery);
            const plId = list as string;
            const items = await ytpl(plId)
                .then((res) => {
                    return res.items.map((item) => {
                        return item.shortUrl;
                    });
                })
                .catch((err) => {
                    // message.channel.send(err.message);
                    return '';
                });
            return {
                url: items,
            };
        })();
    }
    if (validator.isURL(urlOrQuery)) {
        return (async () => {
            const title = await getInfo(urlOrQuery).then(
                (info) => info.videoDetails.title,
            );
            return {
                url: urlOrQuery,
                title,
            };
        })();
    }

    return (async () => {
        const [, ...tmp] = message.content.trim().split(' ');
        const { url, title } = await ytsr(tmp.join(' '), {
            limit: 1,
            pages: 1,
        })
            .then((res) => res.items[0] as any)
            .catch((err) => {
                console.log(err.message);
                return {
                    url: '',
                };
            });
        return {
            url,
            title,
        };
    })();
};
