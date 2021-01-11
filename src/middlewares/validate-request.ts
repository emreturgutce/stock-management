import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new createHttpError.BadRequest(
                errors
                    .array()
                    .map((err) => err.msg)
                    .toString(),
            ),
        );
    }

    next();
};
