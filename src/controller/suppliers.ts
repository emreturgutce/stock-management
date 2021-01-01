import { Router } from 'express';
import createHttpError from 'http-errors';
import { pool } from '../config/database';
import {
    ADD_SUPPLIER_QUERY,
    GET_SUPPLIERS_QUERY,
    GET_SUPPLIER_BY_ID_QUERY,
} from '../model/supplier';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { first_name, last_name, birth_date } = req.body;
        const { rows } = await pool.query(ADD_SUPPLIER_QUERY, [
            first_name,
            last_name,
            birth_date,
        ]);

        res.status(201).json({
            message: 'New supplier created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid values to create a supplier.',
            ),
        );
    }
});

router.get('/', async (req, res) => {
    const { rows } = await pool.query(GET_SUPPLIERS_QUERY);

    res.json({
        message: 'Suppliers fetched',
        status: 200,
        data: rows,
    });
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { rows } = await pool.query(GET_SUPPLIER_BY_ID_QUERY, [id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound(
                'Supplier not found with the given id',
            ),
        );
    }

    res.json({
        message: 'Supplier fetched with the given id',
        status: 200,
        data: rows,
    });
});

export { router as supplierRouter };