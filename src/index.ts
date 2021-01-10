import { Message } from 'discord.js';
import { getInfo } from 'ytdl-core-discord';
import { DiscordServer } from './core/discordServer';
import { getData } from './core/get-data-youtube';
import { getCommand } from './core/getCommand';
import { play } from './core/play-core';
import { Discord } from './core/server';

const PREFIX = '__';

let servers: { [x: string]: DiscordServer } = {};

const forbidden = (message: Message) => {
    if (!message.member?.voice) {
        return true;
    }
    return message.member?.voice.channelID !== message.guild?.voice?.channelID;
};

const messageHandler = (message: Message) => {
    if (message.content.startsWith(PREFIX) && !message.author.bot) {
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
                    tmp.length && (tmp = tmp.sort(() => Math.random() - 0.5));
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
                          const { title = null } = await getInfo(
                              servers[id]?.loop as string,
                          )
                              .then((res) => res.videoDetails)
                              .catch((err) => {
                                  console.log(err.message);
                                  return { title: null };
                              });
                          title &&
                              message.channel.send(
                                  `Now looping forever | ${title}`,
                              );
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

            case 'help':
                message.channel.send(`
					  	\`\`\`
__audio anyYoutubeSearch
__audio youtubeUrl
__audio spotify Track Link
__audio spotify Playlist Link
__audio spotify Album Link
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
    console.log('triggered');
    const newGld = arg1.channel?.guild.id;
    const oldGld = arg0.channel?.guild.id;

    if (
        arg0.channel?.members
            .array()
            .every((member) => member.user.id === client.client.user!.id) &&
        oldGld
    ) {
        console.log('moved to an empty channel');
        servers[oldGld]?.getConnection.disconnect();
        delete servers[oldGld];
    }
    if (arg0.member?.id === client.client.user?.id) {
        if (!newGld && oldGld && servers[oldGld]) {
            console.log('deleted');
            delete servers[oldGld];
        }
    }
});
