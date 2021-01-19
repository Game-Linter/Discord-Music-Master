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

import { Message, StreamDispatcher, VoiceConnection } from 'discord.js';
import { play } from './play-core';

export class DiscordServer {
    private connection!: VoiceConnection;
    public dispatcher!: StreamDispatcher | null;
    public queue: string[] = [];
    private isAutoplay: any = false;
    private isLoop: any = false;

    constructor(
        message: Message,
        servers: { [x: string]: DiscordServer },
        id: string,
        url: string | string[],
        title?: string,
    ) {
        (async () => {
            try {
                this.connection = (await message.member?.voice.channel?.join()) as VoiceConnection;
                if (Array.isArray(url)) {
                    this.queue.push(...url);
                } else {
                    this.queue.push(url);
                }
                this.dispatcher = await play(
                    this.connection,
                    this.queue,
                    id,
                    message,
                    servers,
                    title,
                ).catch((err) => {
                    console.log(err.message);
                    return null;
                });
                this.setAuto = this.queue[0] as string;
            } catch (error) {
                message.channel.send(error.message);
                delete servers[id];
            }
        })();
    }

    public get loop(): boolean | string {
        return true && this.isLoop;
    }
    public get autoplay(): boolean | string {
        return true && this.isAutoplay;
    }

    public get getQueue(): string[] {
        return this.queue;
    }
    public get getConnection(): VoiceConnection {
        return this.connection;
    }

    public set setDispatcher(dispatcher: StreamDispatcher) {
        this.dispatcher = dispatcher;
    }
    public set setConnection(connection: VoiceConnection) {
        this.connection = connection;
    }

    public set setQueue(queue: any[]) {
        this.queue = queue;
    }

    public set setAuto(v: string | boolean) {
        this.isAutoplay = v;
    }
    public set setLoop(v: string | boolean) {
        this.isLoop = v;
    }
}
