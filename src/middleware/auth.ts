import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.session);
    if (!(req.session as any).userId) {
        return next(Error('You must be authenticated to perform this action'));
    }

    const userId = jwt.verify((req.session as any).userId, JWT_SECRET);

    next();
};
