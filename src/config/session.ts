import session from 'express-session';
import connectRedis from 'connect-redis';
import { v4 as uuid } from 'uuid';
import { NODE_ENV, RedisClient, SESSION_SECRET } from '.';
import { COOKIE_EXPIRATION, COOKIE_NAME, SESSION_PREFIX } from '../constants';

const RedisStore = connectRedis(session);

const isProd = NODE_ENV === 'production';

export const cookieOptions: CookieOptions = {
	sameSite: isProd ? 'none' : 'strict',
	secure: isProd,
	httpOnly: true,
	signed: true,
};

const sessionConfig = session({
	store: new RedisStore({
		client: RedisClient.getInstance(),
		prefix: SESSION_PREFIX,
	}),
	name: COOKIE_NAME,
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	genid: () => uuid(),
	cookie: {
		...cookieOptions,
		maxAge: COOKIE_EXPIRATION,
	},
});

export { sessionConfig as session };
