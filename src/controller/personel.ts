import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import {
    ADD_PERSONEL_QUERY,
    GET_PERSONELS_QUERY,
    GET_PERSONEL_BY_EMAIL,
} from '../model/personel';
import { JWT_SECRET } from '../config';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { rows } = await pool.query(GET_PERSONEL_BY_EMAIL, [email]);
        const isAuth = await bcrypt.compare(password, rows[0].password);
        if (!isAuth) {
            throw new Error('not authenticated');
        }
        (req.session as any).userId = jwt.sign(rows[0].id, JWT_SECRET);
        res.json({ data: rows });
    } catch (err) {
        res.status(401).json({ error: err });
    }
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
