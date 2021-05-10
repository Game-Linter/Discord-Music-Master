import { Message } from 'discord.js';
import { redisClient } from '../core/redis.server';
import { promisify } from 'util';

const getASYNC = promisify(redisClient.get).bind(redisClient);
const setASYNC = promisify(redisClient.set).bind(redisClient);

export class Donation {
    private ttl: number = 0;

    constructor(message: Message, amount: string) {
        const author = message.author.id;

        const author_donations = getASYNC(`donation:${author}`);

        if (isNaN(+amount)) {
            message.channel.send('(-_-) (-_-)');
        } else {
            if (!author_donations) {
                setASYNC(`donation:${author}`, amount);
                this.ttl = +amount;
            } else {
                this.ttl = +amount + +author_donations;
                setASYNC(`donation:${author}`, this.ttl.toString());
            }
        }
    }

    public get total(): number {
        return this.ttl;
    }
}
