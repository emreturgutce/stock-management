import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { validate } from 'uuid';
import { JWT_SECRET, DatabaseClient } from '../config';
import { CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID } from '../queries';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
        return next(
            new createHttpError.Unauthorized(
                'You must be authenticated to perform this action',
            ),
        );
    }

    const userId = jwt.verify(req.session.userId, JWT_SECRET!);

    if (typeof userId === 'string') {
        const isValidUUID = validate(userId);

        if (!isValidUUID) {
            return next(
                new createHttpError.Unauthorized(
                    'You must be authenticated to perform this action',
                ),
            );
        }
    }

    const {
        rows,
    } = await DatabaseClient.getInstance().query(
        CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID,
        [userId],
    );

    if (rows.length === 0) {
        return next(
            new createHttpError.Unauthorized(
                'You must be authenticated to perform this action',
            ),
        );
    }

    next();
};
