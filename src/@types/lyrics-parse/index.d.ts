declare module 'lyrics-parse' {
    import { Author } from 'ytdl-core';
    function lyricsParse(title: string, author: Author): Promise<string>;
    export = lyricsParse;
}
