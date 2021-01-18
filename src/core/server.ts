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
