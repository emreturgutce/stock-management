import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import {
    ADD_PERSONEL_QUERY,
    GET_PERSONELS_QUERY,
    GET_PERSONEL_BY_EMAIL,
    GET_PERSONEL_BY_ID,
} from '../model/personel';
import { JWT_SECRET, NODE_ENV } from '../config';
import { auth } from '../middleware/auth';
import { COOKIE_EXPIRATION, COOKIE_NAME } from '../constants';
import createHttpError from 'http-errors';

const router = Router();

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { rows } = await pool.query(GET_PERSONEL_BY_EMAIL, [email]);
        const isAuth = await bcrypt.compare(password, rows[0].password);

        if (!isAuth) {
            return next(
                new createHttpError.BadRequest('Invalid credentials to login'),
            );
        }

        const token = jwt.sign(rows[0].id, JWT_SECRET!);
        // @ts-ignore
        req.session!.userId = token;

        res.json({ data: rows, message: 'Logged in', status: 200 });
    } catch (err) {
        next(new createHttpError.BadRequest('Invalid credentials to login'));
    }
});

router.get('/logout', auth, async (req, res, next) => {
    req.session.destroy((err: any) => {
        if (err)
            return next(
                new createHttpError.InternalServerError('Could not logged out'),
            );
    });

    res.clearCookie(COOKIE_NAME, {
        sameSite: 'none',
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: COOKIE_EXPIRATION,
    });

    res.status(204).send();
});

router.get('/', auth, async (req, res) => {
    const { rows } = await pool.query(GET_PERSONELS_QUERY);

    res.json({
        message: 'Personels fetched',
        status: 200,
        data: rows,
    });
});

router.get('/current', auth, async (req, res, next) => {
    const { rows } = await pool.query(GET_PERSONEL_BY_ID, [
        jwt.decode((req.session as any).userId),
    ]);

    res.json({
        message: 'Personel fetched with the given id',
        status: 200,
        data: rows,
    });
});

router.post('/', async (req, res, next) => {
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

        const { rows } = await pool.query(ADD_PERSONEL_QUERY, [
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
