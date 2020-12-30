import { Router } from 'express';
import { pool } from '../config/database';
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
    try {
        const data = await pool.query(GET_INVOICES_QUERY);
        res.json({ data: data.rows });
    } catch (err) {
        res.json({ error: err });
    }
});

router.post('/invoices', async (req, res) => {
    const { serial_number, price } = req.body;

    try {
        const { rows } = await pool.query(ADD_INVOICE_QUERY, [
            serial_number,
            price,
        ]);
        res.json({ message: 'invoice added', data: rows });
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/invoices/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_INVOICE_BY_ID_QUERY, [
            req.params.id,
        ]);
        res.json({ data: rows });
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_SALES_QUERY);
        res.json({ data: rows });
    } catch (err) {
        res.json({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_SALE_BY_ID_QUERY, [
            req.params.id,
        ]);
        res.json({ data: rows });
    } catch (err) {
        res.json({ error: err });
    }
});

router.post('/', async (req, res) => {
    const {
        customer_id,
        personel_id,
        car_id,
        invoice_id,
        sale_date,
    } = req.body;

    try {
        const { rows } = await pool.query(ADD_SALE_QUERY, [
            customer_id,
            personel_id,
            car_id,
            invoice_id,
            sale_date,
        ]);
        res.json({ message: 'sale added', data: rows });
    } catch (err) {
        res.json({ error: err });
    }
});

export { router as saleRouter };
