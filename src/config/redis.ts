import Redis, { Redis as RedisType } from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '.';

let redis: RedisType;

try {
    redis = new Redis({
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT, 10),
    });

    console.log(`👹  Connected to Redis`);
} catch (err) {
    console.error(`Error occurred connecting Redis:\n${err}`);
    process.exit(1);
}

export { redis };
