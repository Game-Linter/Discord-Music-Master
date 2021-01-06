import { Message } from 'discord.js';

export const getCommand = (message: Message, prefix: string) => {
	const content = message.content
		.split(' ')[0]
		.slice(prefix.length, message.content.length);
	const id = message.guild!.id;

	return {
		command: content,
		id,
	};
};
