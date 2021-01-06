import validator from 'validator';
import { Message } from 'discord.js';
import { getInfo } from 'ytdl-core-discord';
import ytsr from 'ytsr';

export const getData = (urlOrQuery: string, message: Message) => {
	if (validator.isURL(urlOrQuery)) {
		return (async () => {
			const title = await getInfo(urlOrQuery).then(
				(info) => info.videoDetails.title
			);
			return {
				url: urlOrQuery,
				title,
			};
		})();
	}

	return (async () => {
		const tmp = message.content.split(' ');
		tmp.shift();
		const { url, title } = await ytsr(tmp.join(' '), {
			limit: 1,
			pages: 1,
		}).then((res) => res.items[0] as any);
		return {
			url,
			title,
		};
	})();
};
