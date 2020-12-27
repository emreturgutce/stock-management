import { Router } from 'express';
import { pool } from '../config/database';
import { ADD_CUSTOMER_QUERY, GET_CUSTOMERS_QUERY } from '../model/customer';

const router = Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, birth_date } = req.body;

    try {
        const { rows } = await pool.query(ADD_CUSTOMER_QUERY, [
            first_name,
            last_name,
            birth_date,
        ]);

        res.json({ message: 'customer added', data: rows });
    } catch (err) {
        res.status(400).json({ error: err });
    }
});

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(GET_CUSTOMERS_QUERY);
        res.json({ data: rows });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export { router as customerRouter };
