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
 */ import lyricsParse from 'lyrics-parse';
import { Author, getInfo } from 'ytdl-core';
import { SPOTIFY_URI } from '../core/get-data-youtube';
import { getSpotifyTrack } from './get-spotify-track';
import { getAccessToken } from './get-token';

export const getLyrics = async (url: string) => {
    if (url.startsWith(SPOTIFY_URI)) {
        const { search } = await getSpotifyTrack(await getAccessToken(), url);
        const [title, author] = search.split(' ') as [string, Author];
        return (await lyricsParse(title, author)).slice(0, 1980) as string;
    }
    const [title, author] = await getInfo(url).then((res) => {
        return [res.videoDetails.title, res.videoDetails.author] as [
            string,
            Author,
        ];
    });
    const lyrics = (await lyricsParse(title, author)) as string;
    if (lyrics) {
        return lyrics.slice(0, 1980);
    } else {
        return null;
    }
};
