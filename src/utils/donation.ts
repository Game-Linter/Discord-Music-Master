import { Message } from 'discord.js';
import { redisClient } from '../persistence/redis.server';
import { promisify } from 'util';

const getASYNC = promisify(redisClient.get).bind(redisClient);
const setASYNC = promisify(redisClient.set).bind(redisClient);

export class Donation {
    public ttl: Promise<number>;

    constructor(message: Message, amount: string) {
        this.ttl = new Promise((resolve, reject) => {
            const author = message.author.id;

            getASYNC(`donation:${author}`).then((donations) => {
                if (isNaN(+amount)) {
                    message.channel.send('(-_-) (-_-)');
                } else {
                    if (!donations) {
                        setASYNC(`donation:${author}`, amount).then(
                            (result) => {
                                resolve(+amount);
                            },
                        );
                    } else {
                        setASYNC(
                            `donation:${author}`,
                            (+amount + +donations).toString(),
                        ).then((result) => {
                            resolve(+amount + +donations);
                        });
                    }
                }
            });
        });
    }
}
