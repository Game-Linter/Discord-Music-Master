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

import * as Sentry from '@sentry/node';
import { Client, Message } from 'discord.js';
import { token } from '../config/discord.config';

export class Discord {
    client: Client;
    constructor(init: { messageHandler: (message: Message) => void }) {
        this.client = new Client();
        this.client.on('ready', () => {
            console.log('Server count', this.client.guilds.cache.size);
            this.client.user?.setPresence({
                status: 'online',
                activity: {
                    type: 'COMPETING',
                    name: '__help',
                },
            });
            console.log('Ready!');
        });
        this.client.on('message', (message) => {
            console.log('Message', message);
            console.log('Message', JSON.stringify(message.content));
            init.messageHandler(message);
        });
        this.Login();
    }

    Login() {
        // const Sentry = require('@sentry/node');
        // or use es6 import statements

        // const Tracing = require('@sentry/tracing');
        // or use es6 import statements

        Sentry.init({
            dsn: 'https://abd380ace54d45b69c0fbb409abe5884@o337865.ingest.sentry.io/5742982',

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });

        const transaction = Sentry.startTransaction({
            op: 'test',
            name: 'Production monitoring',
        });

        setTimeout(() => {
            try {
                console.log('Sentry monitoring');
            } catch (e) {
                Sentry.captureException(e);
            } finally {
                transaction.finish();
            }
        }, 99);
        this.client.login(token);
    }
}
