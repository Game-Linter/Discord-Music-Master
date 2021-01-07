import { Message, VoiceConnection, StreamDispatcher } from 'discord.js';
import { Discord } from './core/server';

import { getInfo } from 'ytdl-core-discord';
import { getData } from './core/get-data-youtube';
import { DiscordServer } from './core/discordServer';
import { getCommand } from './core/getCommand';
import { play } from './core/play-core';

const PREFIX = '__';

let servers: { [x: string]: DiscordServer } = {};

const messageHandler = (message: Message) => {
	if (message.content.startsWith(PREFIX) && !message.author.bot) {
		const { command, id } = getCommand(message, PREFIX);
		switch (command) {
			case 'audio':
				if (message.member?.voice.channelID) {
					(async () => {
						const args = message.content.split(' ');
						if (!args[1]) {
							return message.channel.send('Give a link or a youtube search');
						}
						// return;
						const { url, title } = await getData(args[1], message);
						try {
							if (!servers[id]) {
								servers[id] = new DiscordServer(
									message,
									servers,
									id,
									url,
									title
								);
							} else {
								if (Array.isArray(url)) {
									servers[id].queue.push(...url);
								} else {
									servers[id].queue.push(url);
								}
								message.react('🦆');
								title && message.channel.send(`Queued | ${title}`);
							}
							// console.log(connection);
						} catch (error) {
							console.log(error);
						}
					})();
				} else {
					message.channel.send('Connect to a channel first');
				}
				break;
			case 'pause':
				message.react('⏸');
				servers[id].dispatcher?.pause();
				break;
			case 'resume':
				message.react('⏯');
				// dispatcher[id]?.resume();
				servers[id].dispatcher?.resume();
				break;

			case 'fuckoff':
				message.react('🙋‍♂️');
				servers[id].getConnection?.disconnect();
				delete servers[id];
				break;

			case 'skip':
				if (!servers[id].loop) {
					servers[id].queue?.shift();
				}
				(async () => {
					servers[id].dispatcher = await play(
						servers[id].getConnection,
						servers[id].getQueue,
						id,
						message,
						servers
					);
				})();
				break;
			case 'loop':
				servers[id].setLoop = servers[id].loop
					? false
					: servers[id].getQueue[0];
				message.react('♾');
				servers[id].loop
					? (async () => {
							const { title } = await getInfo(servers[id].loop as string).then(
								(res) => res.videoDetails
							);
							message.channel.send(`Now looping forever | ${title}`);
					  })()
					: message.channel.send(`Loop is now off`);
				break;
			case 'autoplay':
				servers[id].setAuto = servers[id].autoplay
					? false
					: servers[id].getQueue[0];
				servers[id].autoplay
					? message.channel.send('AUTOPLAY in now on')
					: message.channel.send('AUTOPLAY in now off');
				// console.log(id, autoplay[id]);
				break;

			default:
				break;
		}
	}
};

const client = new Discord({
	messageHandler,
});
