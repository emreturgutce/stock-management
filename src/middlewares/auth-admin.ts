import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { validate } from 'uuid';
import { DatabaseClient } from '../config';
import { CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID_AND_ROLE } from '../queries';

export const authAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.session.context?.id) {
		return next(
			new createHttpError.Unauthorized(
				'You must be authenticated to perform this action.',
			),
		);
	}

	if (req.session.context?.role !== 'ADMIN') {
		return next(
			new createHttpError.Forbidden(
				'You need admin role to perform this action.',
			),
		);
	}

	const { id, role } = req.session.context;

	if (!validate(id)) {
		return next(
			new createHttpError.Forbidden(
				'You need admin role to perform this action.',
			),
		);
	}

	const {
		rows,
	} = await DatabaseClient.getInstance().query(
		CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID_AND_ROLE,
		[id, role],
	);

	if (rows.length === 0) {
		return next(
			new createHttpError.Forbidden(
				'You need admin role to perform this action',
			),
		);
	}

	next();
};
