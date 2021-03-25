import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import geoip from 'geoip-lite';
import { validate } from 'uuid';
import { DatabaseClient, RedisClient } from '../config';
import { LAST_LOGIN_PREFIX } from '../constants';
import { CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID } from '../queries';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.context?.id) {
		return next(
			new createHttpError.Unauthorized(
				'You must be authenticated to perform this action',
			),
		);
	}

	const { id } = req.session.context;

	if (!validate(id)) {
		return next(
			new createHttpError.Unauthorized(
				'You must be authenticated to perform this action',
			),
		);
	}

	const {
		rows,
	} = await DatabaseClient.getInstance().query(
		CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID,
		[id],
	);

	if (rows.length === 0) {
		return next(
			new createHttpError.Unauthorized(
				'You must be authenticated to perform this action',
			),
		);
	}

	const lastLogin = Date.now();

	req.session.context.lastLogin = lastLogin;

	await RedisClient.addToSet(
		`${LAST_LOGIN_PREFIX}${req.session.context.id}`,
		JSON.stringify({
			geo: geoip.lookup(req.ip),
			ip: req.ip,
			lastLogin,
			sessionId: req.sessionID,
			agent: req.headers['user-agent'],
		}),
		req.sessionID
	);

	next();
};
