import { Message } from 'discord.js';
import _ from 'lodash';
import { DiscordServer } from './core/discordServer';
import { getData, SPOTIFY_URI } from './core/get-data-youtube';
import { getCommand } from './core/getCommand';
import { getTitleYoutube, play } from './core/play-core';
import { Discord } from './core/server';
import { getLyrics } from './utils/get-lyrics';
import { getSpotifyTrack } from './utils/get-spotify-track';
import { getAccessToken } from './utils/get-token';

const PREFIX = '__';

let servers: { [x: string]: DiscordServer } = {};

const forbidden = (message: Message) => {
    if (!message.member?.voice) {
        return true;
    }
    return message.member?.voice.channelID !== message.guild?.voice?.channelID;
};

const messageHandler = (message: Message) => {
    if (
        message.content.startsWith(PREFIX) &&
        !message.author.bot &&
        !(message.author.id === '434778137788678184')
    ) {
        const { command, id } = getCommand(message, PREFIX);
        switch (command) {
            case 'audio':
                if (message.member?.voice.channelID) {
                    (async () => {
                        const msgContent = message.content
                            .trim()
                            .replace(/\s+/g, ' ');
                        const args = msgContent.split(' ');
                        if (!args[1]) {
                            return message.channel.send(
                                'Give a link or a youtube search',
                            );
                        }
                        // return;
                        const { url, title } = await getData(
                            args[1],
                            message,
                        ).catch((err) => {
                            console.log(err);
                            return {
                                url: '',
                                title: '',
                            };
                        });
                        try {
                            if (!servers[id]) {
                                servers[id] = new DiscordServer(
                                    message,
                                    servers,
                                    id,
                                    url,
                                    title,
                                );
                            } else {
                                if (forbidden(message)) {
                                    return message.channel.send(
                                        'Get into the same channel as the bot',
                                    );
                                }
                                if (Array.isArray(url)) {
                                    servers[id]?.queue.push(...url);
                                } else {
                                    servers[id]?.queue.push(url);
                                }
                                message.react('🦆');
                                title &&
                                    message.channel.send(`Queued | ${title}`);
                            }
                            // console.log(connection);
                        } catch (error) {
                            console.log(error.message);
                        }
                    })();
                } else {
                    message.channel.send('Connect to a channel first');
                }
                break;
            case 'audionow':
                (async () => {
                    const msgContent = message.content
                        .trim()
                        .replace(/\s+/g, ' ');
                    const args = msgContent.split(' ');
                    if (!args[1]) {
                        return message.channel.send(
                            'Give a link or a youtube search',
                        );
                    }
                    // return;
                    const { url, title } = await getData(
                        args[1],
                        message,
                    ).catch((err) => {
                        console.log(err);
                        return {
                            url: '',
                            title: '',
                        };
                    });
                    if (forbidden(message)) {
                        return message.channel.send(
                            'Get into the same channel as the bot',
                        );
                    }
                    const [tobeShifted, ...rest] = servers[id].getQueue;
                    if (Array.isArray(url)) {
                        rest.unshift(...url);
                    } else {
                        rest.unshift(url);
                    }

                    servers[id].setQueue = [...rest];
                    message.react('🦆');
                    title && message.channel.send(`Next | ${title}`);
                    servers[id].dispatcher = await play(
                        servers[id]?.getConnection,
                        servers[id].getQueue,
                        id,
                        message,
                        servers,
                    ).catch((err) => {
                        console.log(err.message);
                        return null;
                    });
                })();
                break;

            case 'pause':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                message.react('⏸');
                servers[id]?.dispatcher?.pause();
                break;
            case 'shuffle':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                message.react('🔀');
                let [, ...tmp] = servers[id]?.getQueue;
                (async () => {
                    tmp.length && (tmp = _.shuffle(tmp));
                    servers[id].dispatcher = await play(
                        servers[id]?.getConnection,
                        tmp,
                        id,
                        message,
                        servers,
                    ).catch((err) => {
                        console.log(err.message);
                        return null;
                    });
                })();
                break;
            case 'resume':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                message.react('⏯');
                // dispatcher[id]?.resume();
                servers[id]?.dispatcher?.resume();
                break;

            case 'fuckoff':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                message.react('🙋‍♂️');
                servers[id]?.getConnection?.disconnect();
                delete servers[id];
                break;

            case 'skip':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                if (!servers[id]?.loop) {
                    servers[id]?.queue?.shift();
                    const [first] = servers[id]?.getQueue;
                    if (first && servers[id]?.autoplay) {
                        servers[id].setAuto = first;
                    }
                }
                (async () => {
                    servers[id].dispatcher = await play(
                        servers[id]?.getConnection,
                        servers[id]?.getQueue,
                        id,
                        message,
                        servers,
                    ).catch((err) => {
                        console.log(err.message);
                        return null;
                    });
                })();
                break;
            case 'loop':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                servers[id].setLoop = servers[id]?.loop
                    ? false
                    : servers[id]?.getQueue[0];
                message.react('♾');
                servers[id]?.loop
                    ? (async () => {
                          const ttl = servers[id].loop as string;
                          if (ttl.startsWith(SPOTIFY_URI)) {
                              const { title } = await getSpotifyTrack(
                                  await getAccessToken(),
                                  ttl,
                              );
                              title &&
                                  message.channel.send(
                                      `Now looping forever | ${title}`,
                                  );
                              return;
                          }

                          const title = await getTitleYoutube(ttl);
                          title &&
                              message.channel.send(
                                  `Now looping forever | ${title}`,
                              );
                          return;
                      })()
                    : message.channel.send(`Loop is now off`);
                break;
            case 'autoplay':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                servers[id].setAuto = servers[id]?.autoplay
                    ? false
                    : servers[id]?.getQueue[0];
                message.react('🤖');
                servers[id]?.autoplay
                    ? message.channel.send('AUTOPLAY in now on')
                    : message.channel.send('AUTOPLAY in now off');
                // console.log(id, autoplay[id]);
                break;
            case 'lyrics':
                if (forbidden(message)) {
                    return message.channel.send(
                        'Get into the same channel as the bot',
                    );
                }
                const [url] = servers[id].getQueue;
                (async () => {
                    const lyrics = (await getLyrics(url)) as string;
                    // console.log(lyrics.length);
                    lyrics && message.channel.send(`\`\`\`\n${lyrics}\n\`\`\``);
                })();
                break;

            case 'help':
                message.channel.send(`
					  	\`\`\`
__audio any Youtube Search
__audio youtube Url
__audio youtube Playlist url
__audio spotify Track Link
__audio spotify Playlist Link
__audio spotify Album Link
__audionow  [input] (Plays the given track instantly even tho the queue is full,  continues the queue afterwards)
__skip (Skip current track)
__pause
__resume 
__fuckoff (Quit)
__loop (Loop current Song )
__autoplay (Keep Playing recommended songs after the queue is done)
__shuffle (Shuffle Current Queue)
						\`\`\`
				`);
                break;

            default:
                break;
        }
    }
};

const client = new Discord({
    messageHandler,
});

client.client.on('voiceStateUpdate', (arg0, arg1) => {
    // console.log('triggered');
    const oldGuildID = arg0.channel?.guild.id;
    const newGuildID = arg1.channel?.guild.id;

    if (arg0.member?.id === client.client.user?.id) {
        // Triggered by something happened to the bot
        console.log({
            old: arg0.channel?.members.array().map((vl) => vl.guild.id),
            new: arg1.channel?.members.array().map((va) => va.guild.id),
        });
        if (
            arg1.channel?.members.array().length &&
            arg1.channel?.members
                .array()
                .every((member) => member.user.id === client.client.user!.id) &&
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
        const Members = arg0.channel?.members.array();
        if (
            Members?.length &&
            Members?.every(
                (member) => member.user.id === client.client.user?.id,
            )
        ) {
            const glId = arg0.channel?.guild.id;
            servers[glId!]?.getConnection.disconnect();
            delete servers[glId!];
        }
    }
});
