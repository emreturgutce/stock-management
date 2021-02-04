import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { DatabaseClient } from '../config';
import { validateSale, validateUUID } from '../middlewares';
import {
	ADD_INVOICE_QUERY,
	ADD_SALE_QUERY,
	GET_INVOICES_QUERY,
	GET_INVOICE_BY_ID_QUERY,
	GET_SALES_QUERY,
	GET_SALE_BY_ID_QUERY,
	ADD_CUSTOMER_QUERY,
	MARK_CAR_AS_SOLD_QUERY,
	GET_SALES_BETWEEN_TWO_DATES,
	GET_TOTAL_PROFIT,
	GET_FULL_SALE_INFO,
	GET_LAST_FIVE_SALES,
} from '../queries';
import { createInvoicePdf } from '../utils/create-invoice-pdf';

const router = Router();

router.get('/invoices', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_INVOICES_QUERY,
		);

		res.json({ message: 'Invoices fetched', status: 200, data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

/*
 *  NOT IN USE
 */
router.post('/invoices', async (req, res, next) => {
	try {
		const { serial_number, price } = req.body;
		const {
			rows,
		} = await DatabaseClient.getInstance().query(ADD_INVOICE_QUERY, [
			serial_number,
			price,
		]);
		res.status(201).json({
			message: 'New invoice created',
			status: 201,
			data: rows,
		});
	} catch (err) {
		next(new createHttpError.BadRequest('Bad Request'));
	}
});

router.get(
	'/invoices/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				GET_INVOICE_BY_ID_QUERY,
				[req.params.id],
			);

			if (rows.length === 0) {
				return next(
					new createHttpError.NotFound(
						'Invoice not found with the given id',
					),
				);
			}

			res.json({
				message: 'Invoice fetched with the given id',
				status: 200,
				data: rows,
			});
		} catch (error) {
			next(new createHttpError.BadRequest('Bad Request'));
		}
	},
);

router.get('/', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_SALES_QUERY,
		);

		res.json({ message: 'Sales fetched', status: 200, data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/count', async (req, res, next) => {
	try {
		const fromDate = req.query['from'];
		const toDate = req.query['to'];

		const {
			rows,
		} = await DatabaseClient.getInstance().query(
			GET_SALES_BETWEEN_TWO_DATES,
			[fromDate, toDate],
		);

		const arr = [];

		for (const val of rows) {
			arr.push({
				...val,
				sale_date: new Date(val.sale_date).toLocaleDateString('tr-TR'),
			});
		}

		res.json({
			message: `Sales fetched between ${fromDate} and ${toDate}`,
			status: 200,
			data: arr,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/profit', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_TOTAL_PROFIT,
		);

		res.json({
			message: 'Total profit fetched',
			data: rows[0],
			status: 200,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/latest', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_LAST_FIVE_SALES,
		);

		res.json({
			message: 'Last 5 sales fetched',
			data: rows,
			status: 200,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get(
	'/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(GET_SALE_BY_ID_QUERY, [
				req.params.id,
			]);

			if (rows.length === 0) {
				return next(
					new createHttpError.NotFound(
						'Sale not found with the given id',
					),
				);
			}

			res.json({
				message: 'Sale fetched with the given id',
				status: 200,
				data: rows,
			});
		} catch (error) {
			next(
				new createHttpError.InternalServerError(
					'Internal Server Error',
				),
			);
		}
	},
);

router.get(
	'/:id/pdf',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(GET_FULL_SALE_INFO, [
				req.params.id,
			]);

			if (rows.length === 0) {
				return next(
					new createHttpError.NotFound(
						'Could not found any sale information with the given car id.',
					),
				);
			}

			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader(
				'Content-Disposition',
				'attachment; filename: "fatura.pdf"',
			);

			createInvoicePdf(rows[0]).pipe(res);
		} catch (error) {
			console.log(error);
			next(
				new createHttpError.InternalServerError(
					'Internal Server Error',
				),
			);
		}
	},
);

router.post(
	'/',
	validateSale,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await DatabaseClient.getInstance().query('BEGIN');
			const {
				first_name,
				last_name,
				birth_date,
				serial_number,
				price,
				personel_id,
				car_id,
				sale_date,
			} = req.body;

			/* CREATE THE CUSTOMER */

			const customerRes = await DatabaseClient.getInstance().query(
				ADD_CUSTOMER_QUERY,
				[first_name, last_name, birth_date],
			);

			/* CREATE THE INVOICE */

			const invoiceRes = await DatabaseClient.getInstance().query(
				ADD_INVOICE_QUERY,
				[serial_number, price],
			);

			/* CREATE THE SALE */

			const saleRes = await DatabaseClient.getInstance().query(
				ADD_SALE_QUERY,
				[
					customerRes.rows[0].id,
					personel_id,
					car_id,
					invoiceRes.rows[0].id,
					sale_date,
				],
			);

			await DatabaseClient.getInstance().query(MARK_CAR_AS_SOLD_QUERY, [
				car_id,
			]);

			await DatabaseClient.getInstance().query('COMMIT');

			res.status(201).json({
				message: 'New sale created',
				status: 201,
				data: saleRes.rows,
			});
		} catch (err) {
			await DatabaseClient.getInstance().query('ROLLBACK');
			next(
				new createHttpError.BadRequest(
					'Invalid values to create a sale',
				),
			);
		}
	},
);

export { router as saleRouter };
