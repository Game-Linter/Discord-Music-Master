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

commands.set('audio', new Audio());

const { client } = new Discord({
    commands,
});

client.on(Events.VoiceStateUpdate, (arg0, arg1) => {
    const oldGuildID = arg0.guild.id;
    const newGuildID = arg1.guild.id;

    if (arg0.member?.id === client.user?.id) {
        // Triggered by something happened to the bot
        console.log({
            old: arg0.channel?.members.map((v) => v.user.id),
            new: arg1.channel?.members.map((va) => va.user.id),
        });
        if (
            arg1.channel?.members.size &&
            arg1.channel?.members.every(
                (member) => member.user.id === client.user!.id,
            ) &&
            newGuildID
        ) {
            console.log('Moved to an empty channel');
            servers[newGuildID]?.getConnection.disconnect();
            delete servers[newGuildID];
        }
        if (!newGuildID && oldGuildID && servers[oldGuildID]) {
            console.log('deleted');
            delete servers[oldGuildID];
        }
    } else {
        // Triggered by other people
        const Members = arg0.channel?.members;
        if (
            Members?.size &&
            Members?.every((member) => member.user.id === client.user?.id)
        ) {
            const glId = arg0.guild.id;
            servers[glId!]?.getConnection.disconnect();
            delete servers[glId!];
        }
    }
});

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
