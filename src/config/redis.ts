import Redis, { Redis as RedisType } from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '.';
import { SESSION_PREFIX } from '../constants';

class RedisClient {
	private static client: RedisType;

	static getInstance(): RedisType {
		if (!RedisClient.client) {
			RedisClient.client = new Redis({
				host: REDIS_HOST,
				password: REDIS_PASSWORD,
				port: parseInt(REDIS_PORT, 10),
				connectTimeout: 17000,
				maxRetriesPerRequest: 4,
				retryStrategy: (times) => Math.min(times * 30, 1000),
				reconnectOnError: (error): boolean => {
					const targetErrors = [/READONLY/, /ETIMEDOUT/];

					targetErrors.forEach((targetError) => {
						if (targetError.test(error.message)) {
							return true;
						}
					});

					return false;
				},
			});

			RedisClient.client.on('error', (err) => {
				console.log(`Error occurred connecting Redis: ${err}`.red);
			});

			RedisClient.client.once('connect', () => {
				console.log(`😈 Connected to Redis`.yellow);
			});
		}

		return RedisClient.client;
	}

	static setValue(key: string, value: string) {
		return RedisClient.client.setex(key, 60 * 60 * 24 * 7, value);
	}

	static getValue(key: string) {
		return RedisClient.client.get(key);
	}

	static expireValue(key: string) {
		return RedisClient.client.del(key);
	}

	static async addToSet(
		key: string,
		value: any,
		sessionId: string,
	): Promise<void> {
		const len = await RedisClient.client.llen(key);

		const records = await RedisClient.client.lrange(key, 0, len);

		let idx = 0;

		for (const record of records) {
			const obj = JSON.parse(record);

			if (obj.sessionId === sessionId) {
				break;
			}

			idx++;
		}

		if (idx !== records.length) {
			await RedisClient.client.lset(key, idx, value);
		} else {
			await RedisClient.client.lpush(key, value);
		}
	}

	static getFromSet(key: string) {
		return RedisClient.client.lrange(key, 0, 5);
	}

	static deleteAllSessionOfAUser(id: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const stream = RedisClient.client.scanStream({
				match: `${SESSION_PREFIX}*`,
			});
			const pipeline = RedisClient.client.pipeline();
			const delPipeline = RedisClient.client.pipeline();
			let sessionCount = 0;

			stream.on('data', (keys: Array<string>) => {
				for (const key of keys) {
					pipeline.get(key, (err, res) => {
						if (err) {
							return reject(err);
						}

						const sessionObj = JSON.parse(res);

						if (sessionObj.context.id === id) {
							sessionCount++;
							delPipeline.del(key);
						}
					});
				}
			});

			stream.on('end', async () => {
				await pipeline.exec(async (err) => {
					if (err) {
						return reject(err);
					}

					await delPipeline.exec((err) => {
						if (err) {
							return reject(err);
						}
					});
				});

				return resolve(sessionCount);
			});

			stream.on('error', reject);
		});
	}

	static getLastLoginFromSession(
		ids: Array<string>,
	): Promise<Array<{ id: string; lastLogin: number }>> {
		return new Promise((resolve, reject) => {
			const stream = RedisClient.client.scanStream({
				match: `${SESSION_PREFIX}*`,
			});
			const pipeline = RedisClient.client.pipeline();
			const lastLogins: Array<{ id: string; lastLogin: number }> = [];

			stream.on('data', (keys: Array<string>) => {
				for (const key of keys) {
					pipeline.get(key, (err, res) => {
						if (err) {
							return reject(err);
						}

						const {
							context: { id, lastLogin },
						} = JSON.parse(res);

						if (ids.includes(id)) {
							lastLogins.push({
								lastLogin,
								id,
							});
						}
					});
				}
			});

			stream.on('end', async () => {
				await pipeline.exec(async (err) => {
					if (err) {
						return reject(err);
					}
				});

				return resolve(lastLogins);
			});

			stream.on('error', reject);
		});
	}
}

export { RedisClient };
