import { Router } from 'express';
import createHttpError from 'http-errors';
import { pool } from '../config/database';
import {
    ADD_CAR_COLOR_QUERY,
    ADD_CAR_MANUFACTURER_QUERY,
    ADD_CAR_QUERY,
    DELETE_CAR_BY_ID,
    GET_CARS_QUERY,
    GET_CAR_BY_ID_QUERY,
    GET_CAR_COLORS_QUERY,
    GET_CAR_MANUFACTURER_QUERY,
} from '../model/car';

const router = Router();

router.post('/colors', async (req, res, next) => {
    try {
        const { name } = req.body;
        const { rows } = await pool.query(ADD_CAR_COLOR_QUERY, [
            name.toUpperCase(),
        ]);

        res.status(201).json({
            message: 'New car color added',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest('Invalid values to create a color.'),
        );
    }
});

router.get('/colors', async (req, res) => {
    const { rows } = await pool.query(GET_CAR_COLORS_QUERY);

    res.json({ message: 'Car colors fetched', status: 200, data: rows });
});

router.post('/manufacturers', async (req, res, next) => {
    try {
        const { name } = req.body;
        const { rows } = await pool.query(ADD_CAR_MANUFACTURER_QUERY, [
            name.toUpperCase(),
        ]);

        res.status(201).json({
            message: 'New car manifacturer added',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid values to create a manufacturer.',
            ),
        );
    }
});

router.get('/manufacturers', async (req, res) => {
    const { rows } = await pool.query(GET_CAR_MANUFACTURER_QUERY);

    res.json({ message: 'Car manufacturers fetched', status: 200, data: rows });
});

router.post('/', async (req, res, next) => {
    try {
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

        res.status(201).json({
            message: 'New car created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid credentials to create a car.',
            ),
        );
    }
});

router.get('/', async (req, res) => {
    const { rows } = await pool.query(GET_CARS_QUERY);

    res.json({ message: 'Cars fetched', status: 200, data: rows });
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { rows } = await pool.query(GET_CAR_BY_ID_QUERY, [id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound(`Car not found with the id of ${id}`),
        );
    }

    res.json({
        message: 'Car fetched with the given id.',
        status: 200,
        data: rows,
    });
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    const { rows } = await pool.query(DELETE_CAR_BY_ID, [id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound(`Car not found with the id of ${id}`),
        );
    }

    res.json({
        message: 'Car deleted with the given id.',
        status: 200,
        data: rows,
    });
});

export { router as carRouter };
