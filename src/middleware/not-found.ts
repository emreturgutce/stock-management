import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const notFound = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    throw new createHttpError.NotFound('Route not found');
};
