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
import { JWT_SECRET } from '../config';
import { auth } from '../middleware/auth';
import { COOKIE_NAME } from '../constants';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await pool.query(GET_PERSONEL_BY_EMAIL, [email]);
        const isAuth = await bcrypt.compare(password, rows[0].password);
        if (!isAuth) {
            throw new Error('not authenticated');
        }
        const token = jwt.sign(rows[0].id, JWT_SECRET);
        // @ts-ignore
        req.session!.userId = token;
        res.json({ data: { ...rows, token } });
    } catch (err) {
        res.status(400).json({ error: 'Invalid Credentials' });
    }
});

router.get('/logout', auth, async (req, res) => {
    return new Promise((resolve, reject) => {
        req.session.destroy((err: any) => {
            if (err) res.json({ message: 'could not logged out', error: err });
        });
        res.clearCookie(COOKIE_NAME);
        res.json({ message: 'logged out' });
    });
});

router.get('/', auth, async (req, res) => {
    let data;

    try {
        data = await pool.query(GET_PERSONELS_QUERY);
    } catch (err) {
        return res.json({
            error: err,
        });
    }

    res.json({
        data: data.rows,
    });
});

router.get('/current', auth, async (req, res) => {
    console.log(req.session);
    try {
        const data = await pool.query(GET_PERSONEL_BY_ID, [
            jwt.decode((req.session as any).userId),
        ]);
        res.json({
            data: data.rows,
        });
    } catch (err) {
        res.json({
            error: err,
        });
    }
});

router.post('/', async (req, res) => {
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

        res.json({
            message: 'personel added successfully',
            data: rows,
        });
    } catch (err) {
        res.status(400).json({
            message: 'an error ocurred adding personel',
            error: err,
        });
    }
});

export { router as personelRouter };
