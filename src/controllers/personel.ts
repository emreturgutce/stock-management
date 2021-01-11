import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseClient, cookieOptions, JWT_SECRET } from '../config';
import {
    ADD_PERSONEL_QUERY,
    GET_PERSONELS_QUERY,
    GET_PERSONEL_BY_EMAIL,
    GET_PERSONEL_BY_ID,
} from '../queries';
import { auth, rateLimiter, validateLogin } from '../middlewares';
import { COOKIE_NAME } from '../constants';

const router = Router();

router.post(
    '/login',
    rateLimiter,
    validateLogin,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const {
                rows,
            } = await DatabaseClient.getInstance().query(
                GET_PERSONEL_BY_EMAIL,
                [email],
            );
            const isAuth = await bcrypt.compare(password, rows[0].password);

            if (!isAuth) {
                return next(
                    new createHttpError.Unauthorized(
                        'Invalid credentials to login',
                    ),
                );
            }

            const token = jwt.sign(rows[0].id, JWT_SECRET!);

            req.session.userId = token;

            res.json({ data: rows, message: 'Logged in', status: 200 });
        } catch (err) {
            next(
                new createHttpError.Unauthorized(
                    'Invalid credentials to login',
                ),
            );
        }
    },
);

router.get('/logout', auth, async (req, res, next) => {
    req.session.destroy((err: any) => {
        if (err)
            return next(
                new createHttpError.InternalServerError('Could not logged out'),
            );
    });

    res.clearCookie(COOKIE_NAME, cookieOptions);

    res.status(204).send();
});

router.get('/', auth, async (req, res) => {
    const { rows } = await DatabaseClient.getInstance().query(
        GET_PERSONELS_QUERY,
    );

    res.json({
        message: 'Personels fetched',
        status: 200,
        data: rows,
    });
});

router.get('/current', auth, async (req, res, next) => {
    const {
        rows,
    } = await DatabaseClient.getInstance().query(GET_PERSONEL_BY_ID, [
        jwt.decode((req.session as any).userId),
    ]);

    res.json({
        message: 'Personel fetched with the given id',
        status: 200,
        data: rows,
    });
});

router.post('/', rateLimiter, async (req, res, next) => {
    try {
        const {
            first_name,
            last_name,
            birth_date,
            email,
            password,
            gender,
            hire_date,
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const {
            rows,
        } = await DatabaseClient.getInstance().query(ADD_PERSONEL_QUERY, [
            first_name,
            last_name,
            birth_date,
            email,
            hashedPassword,
            gender,
            hire_date,
        ]);

        res.status(201).json({
            message: 'New Personel created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid values to create a personel.',
            ),
        );
    }
});

export { router as personelRouter };
