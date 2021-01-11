import Redis, { Redis as RedisType } from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '.';

class RedisClient {
    private static client: RedisType;

    static getInstance(): RedisType {
        if (!RedisClient.client) {
            RedisClient.client = new Redis({
                host: REDIS_HOST,
                password: REDIS_PASSWORD,
                port: parseInt(REDIS_PORT, 10),
            });

            RedisClient.client.once('error', (err) => {
                console.log(`Error occurred connecting Redis: ${err}`.red);
            });

            RedisClient.client.once('connect', () => {
                console.log(`😈 Connected to Redis`.yellow);
            });
        }

        return RedisClient.client;
    }
}

RedisClient.getInstance();

export { RedisClient };
