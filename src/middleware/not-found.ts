import { Request, Response, NextFunction } from 'express';

export const notFound = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    next(Error('Route not found'));
};
