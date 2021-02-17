import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { RedisClient } from '../config';
import { RATE_LIMIT, RATE_LIMIT_PREFIX, RATE_LIMIT_TIME } from '../constants';

const rateLimiterRedis = new RateLimiterRedis({
	storeClient: RedisClient.getInstance(),
	keyPrefix: RATE_LIMIT_PREFIX,
	points: RATE_LIMIT,
	duration: RATE_LIMIT_TIME,
});

export const rateLimiter = () => async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		await rateLimiterRedis.consume(req.ip);
		next();
	} catch (err) {
		res.status(429).json({ message: 'Too many requests', status: 429 });
	}
};
