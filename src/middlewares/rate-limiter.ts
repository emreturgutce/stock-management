import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../config';

const rateLimiterRedis = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: 'ratelimit',
    points: 5,
    duration: 60,
});

export const rateLimiter = async (
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
