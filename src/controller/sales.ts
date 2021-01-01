import { Router } from 'express';
import createHttpError, { NotExtended } from 'http-errors';
import { pool } from '../config/database';
import { MARK_CAR_AS_SOLD_QUERY } from '../model/car';
import {
    ADD_INVOICE_QUERY,
    ADD_SALE_QUERY,
    GET_INVOICES_QUERY,
    GET_INVOICE_BY_ID_QUERY,
    GET_SALES_QUERY,
    GET_SALE_BY_ID_QUERY,
} from '../model/sale';

const router = Router();

router.get('/invoices', async (req, res) => {
    const { rows } = await pool.query(GET_INVOICES_QUERY);

    res.json({ message: 'Invoices fetched', status: 200, data: rows });
});

router.post('/invoices', async (req, res) => {
    const { serial_number, price } = req.body;

    try {
        const { rows } = await pool.query(ADD_INVOICE_QUERY, [
            serial_number,
            price,
        ]);
        res.status(201).json({
            message: 'New invoice created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/invoices/:id', async (req, res, next) => {
    const { id } = req.params;
    const { rows } = await pool.query(GET_INVOICE_BY_ID_QUERY, [id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound('Invoice not found with the given id'),
        );
    }

    res.json({
        message: 'Invoice fetched with the given id',
        status: 200,
        data: rows,
    });
});

router.get('/', async (req, res) => {
    const { rows } = await pool.query(GET_SALES_QUERY);

    res.json({ message: 'Sales fetched', status: 200, data: rows });
});

router.get('/:id', async (req, res, next) => {
    const { rows } = await pool.query(GET_SALE_BY_ID_QUERY, [req.params.id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound('Sale not found with the given id'),
        );
    }

    res.json({
        message: 'Sale fetched with the given id',
        status: 200,
        data: rows,
    });
});

router.post('/', async (req, res, next) => {
    try {
        const {
            customer_id,
            personel_id,
            car_id,
            invoice_id,
            sale_date,
        } = req.body;

        const { rows } = await pool.query(ADD_SALE_QUERY, [
            customer_id,
            personel_id,
            car_id,
            invoice_id,
            sale_date,
        ]);

        await pool.query(MARK_CAR_AS_SOLD_QUERY, [car_id]);

        res.status(201).json({
            message: 'New sale created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(new createHttpError.BadRequest('Invalid values to create a sale'));
    }
});

export { router as saleRouter };
