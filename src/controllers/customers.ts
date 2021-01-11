import { Router } from 'express';
import createHttpError from 'http-errors';
import { DatabaseClient } from '../config';
import { ADD_CUSTOMER_QUERY, GET_CUSTOMERS_QUERY } from '../queries';

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { first_name, last_name, birth_date } = req.body;

        const {
            rows,
        } = await DatabaseClient.getInstance().query(ADD_CUSTOMER_QUERY, [
            first_name,
            last_name,
            birth_date,
        ]);

        res.status(201).json({
            message: 'New customer created',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid values to create a customer.',
            ),
        );
    }
});

router.get('/', async (req, res) => {
    const { rows } = await DatabaseClient.getInstance().query(
        GET_CUSTOMERS_QUERY,
    );

    res.json({ message: 'Customers fetched', status: 200, data: rows });
});

export { router as customerRouter };
