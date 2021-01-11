import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { CustomError } from '../errors';

export const errorHandler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    if (error instanceof HttpError) {
        return response
            .status(error.statusCode)
            .json({ message: error.message, status: error.statusCode });
    }

    if (error instanceof CustomError) {
        return response.status(error.statusCode).json({
            message: error.reason,
            status: error.statusCode,
        });
    }

    response.status(500).json({ error: 'Internal Server Error', status: 500 });
};
