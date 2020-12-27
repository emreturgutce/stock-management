import { Router } from 'express';
import { pool } from '../config/database';
import {
    ADD_CAR_COLOR_QUERY,
    ADD_CAR_MANUFACTURER_QUERY,
    ADD_CAR_QUERY,
    GET_CARS_QUERY,
    GET_CAR_BY_ID_QUERY,
    GET_CAR_COLORS_QUERY,
    GET_CAR_MANUFACTURER_QUERY,
} from '../model/car';

const router = Router();

router.post('/', async (req, res) => {
    const {
        title,
        sale_price,
        purchase_price,
        is_sold,
        description,
        model,
        year,
        is_new,
        enter_date,
        supplier_id,
        personel_id,
        car_manufacturer_id,
        car_color_code,
    } = req.body;

    try {
        const { rows } = await pool.query(ADD_CAR_QUERY, [
            title,
            sale_price,
            purchase_price,
            is_sold,
            description,
            model,
            year,
            is_new,
            enter_date,
            supplier_id,
            personel_id,
            car_manufacturer_id,
            car_color_code,
        ]);
        res.json({ message: 'car added', data: rows });
    } catch (err) {
        res.json({ err });
    }
});

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_CARS_QUERY);
        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    let data;

    try {
        data = await pool.query(GET_CAR_BY_ID_QUERY, [req.params.id]);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
    res.json({ data });
});

router.post('/colors', async (req, res) => {
    try {
        const { name } = req.body;
        const { rows } = await pool.query(ADD_CAR_COLOR_QUERY, [
            name.toUpperCase(),
        ]);

        res.json({ message: 'car color added', data: rows });
    } catch (err) {
        res.status(400).json({ message: 'could not add car color' });
    }
});

router.get('/colors', async (req, res) => {
    let data;

    try {
        data = await pool.query(GET_CAR_COLORS_QUERY);
    } catch (err) {
        return res.status(500).json({ error: err });
    }
    res.json({ data });
});

router.post('/manufacturers', async (req, res) => {
    try {
        const { name } = req.body;
        const { rows } = await pool.query(ADD_CAR_MANUFACTURER_QUERY, [
            name.toUpperCase(),
        ]);

        res.json({ message: 'car manifacturer added', data: rows });
    } catch (err) {
        res.status(400).json({
            message: 'could not add car manifacturer',
            err,
        });
    }
});

router.get('/manufacturers', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_CAR_MANUFACTURER_QUERY);

        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export { router as carRouter };
