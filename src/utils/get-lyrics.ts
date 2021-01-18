import lyricsParse from 'lyrics-parse';
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
