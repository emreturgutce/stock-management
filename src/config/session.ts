import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis, SESSION_SECRET } from '.';
import { COOKIE_EXPIRATION, COOKIE_NAME } from '../constants';

const RedisStore = connectRedis(session);

export const createSession = () =>
    session({
        store: new RedisStore({
            client: redis,
        }),
        name: COOKIE_NAME,
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: COOKIE_EXPIRATION,
        },
    });