import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { validate } from 'uuid';
import { DatabaseClient } from '../config';
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

	req.session.context.lastLogin = Date.now();

	next();
};
