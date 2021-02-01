import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import { AWS_S3_BUCKET, DatabaseClient } from '../config';
import { ForeignKeyConstaintError, UniqueKeyConstaintError } from '../errors';
import {
	uploadAvatar,
	validateCarColor,
	validateCarManufacturer,
	validateCar,
	validateUUID,
} from '../middlewares';
import {
	ADD_CAR_COLOR_QUERY,
	ADD_CAR_IMAGE,
	ADD_CAR_MANUFACTURER_QUERY,
	ADD_CAR_QUERY,
	DELETE_CAR_BY_ID,
	GET_CARS_QUERY_NEW,
	GET_CAR_BY_ID_QUERY,
	GET_CAR_COLORS_QUERY,
	GET_CAR_IMAGES_BY_ID,
	GET_CAR_MANUFACTURER_QUERY,
	UPDATE_CAR_BY_ID,
} from '../queries';
import { uploadAvatarToS3 } from '../utils';

const router = Router();

router.post(
	'/colors',
	validateCarColor,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				rows,
			} = await DatabaseClient.getInstance().query(ADD_CAR_COLOR_QUERY, [
				req.body.name,
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
				return next(new UniqueKeyConstaintError());
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
				return next(new UniqueKeyConstaintError());
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

router.post(
	'/',
	uploadAvatar,
	validateCar,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await DatabaseClient.getInstance().query('BEGIN');

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

			const carRes = await DatabaseClient.getInstance().query(
				ADD_CAR_QUERY,
				[
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
				],
			);

			if (req.file) {
				const extension = req.file.originalname.split('.')[1];

				const avatarId = `${uuid()}.${extension}`;

				const imageURL = `https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${avatarId}`;

				const uploadAvatarPromise = uploadAvatarToS3(
					avatarId,
					req.file.buffer,
				);

				const addCarImagePromise = DatabaseClient.getInstance().query(
					ADD_CAR_IMAGE,
					[imageURL, carRes.rows[0].car_id],
				);

				await Promise.all([uploadAvatarPromise, addCarImagePromise]);
			}

			await DatabaseClient.getInstance().query('COMMIT');

			res.status(201).json({
				message: 'New car created',
				status: 201,
				data: carRes.rows,
			});
		} catch (error) {
			await DatabaseClient.getInstance().query('ROLLBACK');

			if (
				error.message.includes(
					'duplicate key value violates unique constraint',
				)
			) {
				return next(new UniqueKeyConstaintError());
			} else if (
				error.message.includes('violates foreign key constraint')
			) {
				return next(new ForeignKeyConstaintError());
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
	validateCar,
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

			await DatabaseClient.getInstance().query(UPDATE_CAR_BY_ID, [
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
			]);

			res.status(204).send();
		} catch (error) {
			if (
				error.message.includes(
					'duplicate key value violates unique constraint',
				)
			) {
				return next(new UniqueKeyConstaintError());
			} else if (
				error.message.includes('violates foreign key constraint')
			) {
				return next(new ForeignKeyConstaintError());
			} else if (error.message.includes('invalid input syntax')) {
				return next(new createHttpError.BadRequest('Invalid input'));
			}

			next(new createHttpError.InternalServerError());
		}
	},
);

router.get('/', async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_CARS_QUERY_NEW,
		);

		res.json({ message: 'Cars fetched', status: 200, data: rows });
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
	uploadAvatar,
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.file) {
			return next(new createHttpError.BadRequest('Please upload a file'));
		}

		const extension = req.file.originalname.split('.')[1];

		const avatarId = `${uuid()}.${extension}`;

		const imageURL = `https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${avatarId}`;

		try {
			await uploadAvatarToS3(avatarId, req.file.buffer);

			await DatabaseClient.getInstance().query(ADD_CAR_IMAGE, [
				imageURL,
				req.params.id,
			]);

			res.json({ message: 'Image saved', status: 200 });
		} catch (err) {
			next(new createHttpError.BadRequest('Not valid image'));
		}
	},
);

router.delete(
	'/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;

			const {
				rows,
			} = await DatabaseClient.getInstance().query(DELETE_CAR_BY_ID, [
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
				message: 'Car deleted with the given id.',
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

export { router as carRouter };
