import { Client, Message } from 'discord.js';
import { token } from '../config/discord.config';

export class Discord {
	client: Client;
	constructor(init: { messageHandler: (message: Message) => void }) {
		this.client = new Client();
		this.client.on('ready', () => {
			this.client.user?.setPresence({
				status: 'online',
				activity: {
					type: 'COMPETING',
					name: '__audio',
				},
			});
			console.log('Ready!');
		});
		this.client.on('message', init.messageHandler);
		this.Login();
	}

	Login() {
		this.client.login(token);
	}
}
