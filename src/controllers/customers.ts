import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { DatabaseClient } from '../config';
import { validateCustomer } from '../middlewares';
import {
	ADD_CUSTOMER_QUERY,
	GET_CUSTOMERS_QUERY,
	GET_CUSTOMER_COUNT,
	GET_MONTHLY_TOTAL_CUSTOMERS,
} from '../queries';

const router = Router();

router.post(
	'/',
	validateCustomer,
	async (req: Request, res: Response, next: NextFunction) => {
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
	},
);

router.get('/', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_CUSTOMERS_QUERY,
		);

		res.json({ message: 'Customers fetched', status: 200, data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/count', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_CUSTOMER_COUNT,
		);

		res.json({
			message: 'Customer count fetched',
			status: 200,
			data: rows,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/monthly-total-customers', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_MONTHLY_TOTAL_CUSTOMERS,
		);

		res.json({
			message: 'Month by month customer count fetched',
			status: 200,
			data: rows,
		});
		
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
})

export { router as customerRouter };
