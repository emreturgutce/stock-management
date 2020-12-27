import { Router } from 'express';
import { pool } from '../config/database';
import { ADD_PERSONEL_QUERY, GET_PERSONELS_QUERY } from '../model/personel';

const router = Router();

router.get('/', async (req, res) => {
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

        const { rows } = await pool.query(ADD_PERSONEL_QUERY, [
            first_name,
            last_name,
            birth_date,
            email,
            password,
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
