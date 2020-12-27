import { Router } from 'express';
import { pool } from '../config/database';
import {
    ADD_SUPPLIER_QUERY,
    GET_SUPPLIERS_QUERY,
    GET_SUPPLIER_BY_ID_QUERY,
} from '../model/supplier';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, birth_date } = req.body;
        const { rows } = await pool.query(ADD_SUPPLIER_QUERY, [
            first_name,
            last_name,
            birth_date,
        ]);

        res.json({
            message: 'supplier added',
            data: rows,
        });
    } catch (err) {
        res.status(400).json({
            error: err,
        });
    }
});

router.get('/', async (req, res) => {
    let data;

    try {
        data = await pool.query(GET_SUPPLIERS_QUERY);
    } catch (err) {
        return res.json({
            error: err,
        });
    }

    res.json({
        data: data.rows,
    });
});

router.get('/:id', async (req, res) => {
    let data;

    try {
        data = await pool.query(GET_SUPPLIER_BY_ID_QUERY, [req.params.id]);
    } catch (err) {
        return res.json({
            error: err,
        });
    }

    res.json({
        data: data.rows,
    });
});

export { router as supplierRouter };
