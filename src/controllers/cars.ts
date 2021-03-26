import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import format from 'pg-format';
import { AWS_S3_BUCKET, DatabaseClient, RedisClient } from '../config';
import { ForeignKeyConstraintError, UniqueKeyConstraintError } from '../errors';
import {
	validateCarColor,
	validateCarManufacturer,
	validateCar,
	validateUUID,
	validateUpdateCar,
	uploadAvatars,
	validateDeleteImages,
	uploadExcel,
	authAdmin,
} from '../middlewares';
import {
	ADD_ACTION_TO_AWAITING_LIST,
	ADD_CARS_QUERY,
	ADD_CAR_COLOR_QUERY,
	ADD_CAR_MANUFACTURER_QUERY,
	ADD_CAR_QUERY,
	ADD_DELETE_CAR_ACTION,
	ADD_MULTI_CAR_IMAGE,
	DELETE_CAR_BY_ID,
	DELETE_MULTI_CAR_IMAGE,
	GET_CARS_QUERY_NEW,
	GET_CAR_BY_ID_QUERY,
	GET_CAR_COLORS_QUERY,
	GET_CAR_IMAGES_BY_ID,
	GET_CAR_MANUFACTURER_QUERY,
	GET_AWAITING_LIST,
	UPDATE_CAR_BY_ID,
	UPDATE_CAR_STATE_TO_AWAITING,
	GET_CAR_FROM_AWAITING_LIST,
	ADD_CUSTOMER_QUERY,
	ADD_SALE_QUERY,
	ADD_INVOICE_QUERY,
	MARK_CAR_AS_SOLD_QUERY,
	CHECK_IF_CAR_IS_IN_WAITING_STATE,
	DELETE_EVENT_FROM_AWAITING_LIST,
	UPDATE_CAR_STATE_TO_NONE,
	GET_COMPLETED_EVENTS,
	ABORT_EVENT,
} from '../queries';
import {
	deleteAvatarFromS3,
	uploadAvatarToS3,
	readCarRecordsFromExcel,
} from '../utils';

const router = Router();

router.post(
	'/colors',
	validateCarColor,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(ADD_CAR_COLOR_QUERY, [
				req.body.name.toLowerCase(),
			]);

			res.status(201).json({
				message: 'New car color added',
				status: 201,
				data: rows,
			});
		} catch (error) {
			if (
				error.message ===
				'duplicate key value violates unique constraint "car_colors_name_key"'
			) {
				return next(new UniqueKeyConstraintError());
			}

			next(new createHttpError.BadRequest(error.message));
		}
	},
);

router.get('/colors', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_CAR_COLORS_QUERY,
		);

		res.json({ message: 'Car colors fetched', status: 200, data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.post(
	'/manufacturers',
	validateCarManufacturer,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				ADD_CAR_MANUFACTURER_QUERY,
				[req.body.name],
			);

			res.status(201).json({
				message: 'New car manifacturer added',
				status: 201,
				data: rows,
			});
		} catch (error) {
			if (
				error.message ===
				'duplicate key value violates unique constraint "car_manufacturers_name_key"'
			) {
				return next(new UniqueKeyConstraintError());
			}

			next(new createHttpError.BadRequest(error.message));
		}
	},
);

router.get('/manufacturers', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_CAR_MANUFACTURER_QUERY,
		);

		res.json({
			message: 'Car manufacturers fetched',
			status: 200,
			data: rows,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/awaiting-list', authAdmin, async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_AWAITING_LIST,
		);

		res.status(200).json({ data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Something went wrong'));
	}
});

router.get('/completed-events', authAdmin, async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_COMPLETED_EVENTS,
		);

		res.status(200).json({ data: rows });
	} catch (error) {
		next(new createHttpError.InternalServerError('Something went wrong'));
	}
});

router.post(
	'/',
	validateCar,
	async (req: Request, res: Response, next: NextFunction) => {
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

			await Promise.all([
				DatabaseClient.getInstance().query(ADD_CAR_QUERY, [
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
				]),
				RedisClient.expireValue('cars'),
			]);

			res.status(201).json({
				message: 'New car created',
				status: 201,
			});
		} catch (error) {
			if (
				error.message.includes(
					'duplicate key value violates unique constraint',
				)
			) {
				return next(new UniqueKeyConstraintError());
			} else if (
				error.message.includes('violates foreign key constraint')
			) {
				return next(new ForeignKeyConstraintError());
			} else if (error.message.includes('invalid input syntax')) {
				return next(new createHttpError.BadRequest('Invalid input'));
			}

			next(new createHttpError.InternalServerError());
		}
	},
);

router.put(
	'/:id',
	validateUUID,
	validateUpdateCar,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				title,
				sale_price,
				purchase_price,
				description,
				model,
				year,
				is_new,
				enter_date,
				supplier_id,
				car_manufacturer_id,
				car_color_code,
			} = req.body;

			await Promise.all([
				DatabaseClient.getInstance().query(UPDATE_CAR_BY_ID, [
					title,
					description,
					sale_price,
					purchase_price,
					enter_date,
					year,
					model,
					is_new,
					car_color_code,
					car_manufacturer_id,
					supplier_id,
					req.params.id,
				]),
				RedisClient.expireValue('cars'),
			]);

			res.status(204).send();
		} catch (error) {
			if (
				error.message.includes(
					'duplicate key value violates unique constraint',
				)
			) {
				return next(new UniqueKeyConstraintError());
			} else if (
				error.message.includes('violates foreign key constraint')
			) {
				return next(new ForeignKeyConstraintError());
			} else if (error.message.includes('invalid input syntax')) {
				return next(new createHttpError.BadRequest('Invalid input'));
			}

			next(new createHttpError.InternalServerError());
		}
	},
);

router.get('/', async (req, res, next) => {
	try {
		const carsString = await RedisClient.getValue('cars');
		let cars: any[] = [];

		if (!carsString) {
			const { rows } = await DatabaseClient.getInstance().query(
				GET_CARS_QUERY_NEW,
			);

			await RedisClient.setValue('cars', JSON.stringify(rows));

			cars = rows;
		} else {
			cars = JSON.parse(carsString) as any[];
		}

		res.json({ message: 'Cars fetched', status: 200, data: cars });
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get(
	'/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const {
				rows,
			} = await DatabaseClient.getInstance().query(GET_CAR_BY_ID_QUERY, [
				id,
			]);

			if (rows.length === 0) {
				return next(
					new createHttpError.NotFound(
						`Car not found with the id of ${id}`,
					),
				);
			}

			res.json({
				message: 'Car fetched with the given id.',
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
	'/:id/images',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(GET_CAR_IMAGES_BY_ID, [
				req.params.id,
			]);

			if (rows.length === 0) {
				return next(new createHttpError.NotFound('No image found'));
			}

			res.json({
				message: 'All car images fetched with the given id.',
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

router.post(
	'/:id/images',
	validateUUID,
	uploadAvatars,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (req.files.length < 1) {
				return next(
					new createHttpError.BadRequest(
						'Please upload at least one file',
					),
				);
			}

			const promises: Array<Promise<any>> = [];
			const imageURLs: Array<Array<string>> = [];

			for (const file of req.files as Express.Multer.File[]) {
				const avatarId = `${uuid()}.webp`;

				const imageURL = `https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${avatarId}`;

				imageURLs.push([imageURL, req.params.id]);

				promises.push(uploadAvatarToS3(avatarId, file.buffer));
			}

			await Promise.all([
				...promises,
				DatabaseClient.getInstance().query(
					format(ADD_MULTI_CAR_IMAGE, imageURLs),
				),
				RedisClient.expireValue('cars'),
			]);

			res.json({ message: 'Image saved', status: 200 });
		} catch (err) {
			console.log(err);
			next(new createHttpError.BadRequest('Not valid image'));
		}
	},
);

router.delete(
	'/:id/images',
	validateUUID,
	validateDeleteImages,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { images }: { images: [string] } = req.body;

			await Promise.all([
				DatabaseClient.getInstance().query(
					format(
						DELETE_MULTI_CAR_IMAGE,
						req.params.id,
						images.map(
							(image) =>
								`https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${image}`,
						),
					),
				),
				images.map((image) => deleteAvatarFromS3(image)),
				RedisClient.expireValue('cars'),
			]);

			res.status(204).send();
		} catch (error) {
			next(new createHttpError.BadRequest('Not valid image'));
		}
	},
);

router.delete(
	'/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id: carId } = req.params;
			const { id: personelId } = req.session.context;

			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				CHECK_IF_CAR_IS_IN_WAITING_STATE,
				[carId],
			);

			if (rows.length > 0) {
				return next(
					new createHttpError.BadRequest(
						'Car is already in waiting state',
					),
				);
			}

			const {
				rows: [{ id: actionId }],
			} = await DatabaseClient.getInstance().query(ADD_DELETE_CAR_ACTION);

			await Promise.all([
				DatabaseClient.getInstance().query(
					ADD_ACTION_TO_AWAITING_LIST,
					[carId, personelId, actionId],
				),
				DatabaseClient.getInstance().query(
					UPDATE_CAR_STATE_TO_AWAITING,
					[carId],
				),
				RedisClient.expireValue('cars'),
			]);

			res.json({
				message:
					'Car delete action added to awaiting list waiting for admin confirmation.',
				status: 200,
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
	'/:id/abort-action', // car_id
	authAdmin,
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;

			await Promise.all([
				DatabaseClient.getInstance().query(
					ABORT_EVENT,
					[id],
				),
				DatabaseClient.getInstance().query(UPDATE_CAR_STATE_TO_NONE, [
					id,
				]),
				RedisClient.expireValue('cars'),
			]);

			res.status(204).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.get(
	'/:id/confirm-action', // awating list id
	authAdmin,
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				GET_CAR_FROM_AWAITING_LIST,
				[req.params.id],
			);

			const { type, car_id, personel_id } = rows[0];

			if (type === 'DELETE') {
				const {
					rows: rowsImage,
				} = await DatabaseClient.getInstance().query(
					GET_CAR_IMAGES_BY_ID,
					[car_id],
				);

				const myRegex = /(.*\.com\/)(.*)/;
				const images = rowsImage.map(
					(row) => myRegex.exec(row.image_url)?.[2],
				);

				await Promise.all([
					images.map((image) => deleteAvatarFromS3(image as string)),
					DatabaseClient.getInstance().query(DELETE_CAR_BY_ID, [
						car_id,
					]),
					RedisClient.expireValue('cars'),
					DatabaseClient.getInstance().query(
						DELETE_EVENT_FROM_AWAITING_LIST,
						[car_id],
					),
				]);

				return res.json({
					message: 'Car deleted with the given id.',
					status: 204,
				});
			} else if (type === 'SELL') {
				const {
					customer_first_name,
					customer_last_name,
					customer_birth_date,
					invoice_serial_number,
					invoice_price,
					sale_date,
				} = rows[0];

				const [customerRes, invoiceRes] = await Promise.all([
					DatabaseClient.getInstance().query(ADD_CUSTOMER_QUERY, [
						customer_first_name,
						customer_last_name,
						customer_birth_date,
					]),
					DatabaseClient.getInstance().query(ADD_INVOICE_QUERY, [
						invoice_serial_number,
						invoice_price,
					]),
				]);

				const [saleRes] = await Promise.all([
					DatabaseClient.getInstance().query(ADD_SALE_QUERY, [
						customerRes.rows[0].id,
						personel_id,
						car_id,
						invoiceRes.rows[0].id,
						sale_date,
					]),
					DatabaseClient.getInstance().query(MARK_CAR_AS_SOLD_QUERY, [
						car_id,
					]),
					DatabaseClient.getInstance().query(
						DELETE_EVENT_FROM_AWAITING_LIST,
						[car_id],
					),
					DatabaseClient.getInstance().query(
						UPDATE_CAR_STATE_TO_NONE,
						[car_id],
					),
					RedisClient.expireValue('cars'),
				]);

				return res.json({
					message: 'Car sell operation confirmed successfully',
					status: 200,
					data: saleRes.rows[0],
				});
			}

			res.status(400).json({
				message: 'Bad request',
				status: 400,
			});
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.post(
	'/excel',
	uploadExcel,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const cars = await readCarRecordsFromExcel(req.file); // Read excel document to js array

			for (const car of cars) {
				car.push(req.session.context.id); // Push the personel id to each car
			}

			await Promise.all([
				DatabaseClient.getInstance().query(
					format(ADD_CARS_QUERY, cars),
				),
				RedisClient.expireValue('cars'),
			]);

			res.status(201).json({
				status: 201,
				message: 'All car records added to database.',
			});
		} catch (error) {
			if (error.message.match(/(invalid input syntax)/)) {
				return next(
					new createHttpError.BadRequest(
						'Please make sure all of the columns of your excel file is correct.',
					),
				);
			}

			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

export { router as carRouter };
