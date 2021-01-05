import session from 'express-session';
import connectRedis from 'connect-redis';
import { NODE_ENV, redis, SESSION_SECRET } from '.';
import { COOKIE_EXPIRATION, COOKIE_NAME } from '../constants';

const RedisStore = connectRedis(session);

const isProd = NODE_ENV === 'production';

export const cookieOptions: CookieOptions = {
    sameSite: isProd ? 'none' : 'strict',
    secure: isProd,
    httpOnly: true,
};

export default session({
    store: new RedisStore({
        client: redis,
    }),
    name: COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        ...cookieOptions,
        maxAge: COOKIE_EXPIRATION,
    },
});
