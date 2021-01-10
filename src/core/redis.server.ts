import { redisUri } from '../config/redis.config';
import redis from 'redis';

export const redisClient = redis.createClient({
    url: redisUri,
});
