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
import { globSync } from 'glob';
import { Command } from './commands/command.abstract';
import { hydrateCommands } from './core/hydrateCommands';
import { Discord } from './core/server';

dotenv.config({
    path: '.env.local',
});

const commands = new Map();

const commandsList = new Array();

// use glob to get all commands

const commandFiles = globSync('./commands/*.command.js', {
    dotRelative: true,
    cwd: __dirname,
});

commandFiles.forEach((file) => {
    const command = require(file).default;

    if (!command) {
        throw new Error(`Command ${file} does not export a default export!`);
    }

    const commandInstance = new command() as Command;

    commands.set(commandInstance.data.name, commandInstance);
    commandsList.push(commandInstance);
});

const { handleVoiceStateUpdate, client, servers } = new Discord({
    commands,
});

hydrateCommands(commandsList);

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

const signHandler = () => {
    const srvs = servers.entries();

    const server = srvs.next();

    while (!server.done) {
        server.value[1].getConnection()?.disconnect();
        srvs.next();
    }

    process.exit();
};

process.on('SIGINT', signHandler);
process.on('SIGTERM', signHandler);
