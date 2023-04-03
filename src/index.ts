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

// test

import { Events } from 'discord.js';
import dotenv from 'dotenv';
import { Audio } from './commands/audio.command';
import { DiscordServer } from './core/discordServer';
import { hydrateCommands } from './core/hydrateCommands';
import { Discord } from './core/server';
import { getAsync } from './utils/get-token';

const PREFIX = process.env.PREFIX ?? ('??' as const);

console.log('Starting... with prefix: ', PREFIX);

const servers: { [x: string]: DiscordServer } = {};

dotenv.config({
    path: '.env',
});

const isBanned = async (id: string) => {
    const bannedUsers = await getAsync('bot:banned');
    if (bannedUsers) {
        return JSON.parse(bannedUsers).filter((bannedUser: string) => {
            return bannedUser === id;
        }).length;
    }

    return 0;
};

const commands = new Map();

const allCommands = [new Audio()];

for (const command of allCommands) {
    commands.set(command.data.name, command);
}

const { handleVoiceStateUpdate, client } = new Discord({
    commands,
});

hydrateCommands(allCommands);

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

const signHandler = () => {
    const srvs = Object.keys(servers) as string[];

    srvs.forEach((srv) => {
        const element: DiscordServer = servers[srv];
        element?.getConnection?.disconnect();
    });

    process.exit();
};

process.on('SIGINT', signHandler);
process.on('SIGTERM', signHandler);
