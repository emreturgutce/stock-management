import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { DatabaseClient, cookieOptions, RedisClient } from '../config';
import {
	ADD_PERSONEL_QUERY,
	GET_PERSONELS_QUERY,
	GET_PERSONEL_BY_EMAIL,
	GET_PERSONEL_BY_ID,
	UPDATE_PERSONEL_BY_ID,
	VERIFY_PERSONEL_EMAIL,
} from '../queries';
import {
	auth,
	rateLimiter,
	validateLogin,
	validatePersonel,
	validateUUID,
} from '../middlewares';
import { CONFIRM_USER_PREFIX, COOKIE_NAME } from '../constants';
import { sendEmail } from '../utils/send-mail';
import { createConfirmationUrl } from '../utils/create-confirmation-url';
import { createConfirmationEmailContent } from '../utils/create-confirmation-email-content';
import { validateVerifyToken } from '../middlewares/validate-verify-token';

const router = Router();

router.post(
	'/login',
	rateLimiter,
	validateLogin,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email, password } = req.body;
			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				GET_PERSONEL_BY_EMAIL,
				[email],
			);
			const isAuth = await bcrypt.compare(password, rows[0].password);

			if (!isAuth) {
				return next(
					new createHttpError.Unauthorized(
						'Invalid credentials to login',
					),
				);
			}

			req.session.context = {
				id: rows[0].id,
				verified: rows[0].verified,
				email: rows[0].email,
			};

			res.json({ data: rows, message: 'Logged in', status: 200 });
		} catch (err) {
			next(
				new createHttpError.Unauthorized(
					'Invalid credentials to login',
				),
			);
		}
	},
);

router.get('/logout', auth, async (req, res, next) => {
	try {
		req.session.destroy((err: any) => {
			if (err)
				return next(
					new createHttpError.InternalServerError(
						'Could not logged out',
					),
				);
		});

		res.clearCookie(COOKIE_NAME, cookieOptions);

		res.status(204).send();
	} catch (error) {
		next(new createHttpError.InternalServerError('Could not logged out'));
	}
});

router.get('/', auth, async (req, res, next) => {
	try {
		const { rows } = await DatabaseClient.getInstance().query(
			GET_PERSONELS_QUERY,
		);

		res.json({
			message: 'Personels fetched',
			status: 200,
			data: rows,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.get('/current', auth, async (req, res, next) => {
	try {
		const {
			rows,
		} = await DatabaseClient.getInstance().query(GET_PERSONEL_BY_ID, [
			req.session.context.id,
		]);

		res.json({
			message: 'Personel fetched with the given id',
			status: 200,
			data: rows,
		});
	} catch (error) {
		next(new createHttpError.InternalServerError('Internal Server Error'));
	}
});

router.post(
	'/',
	rateLimiter,
	validatePersonel,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				first_name,
				last_name,
				birth_date,
				email,
				password,
				gender,
				hire_date,
			} = req.body;

			const {
				rows,
			} = await DatabaseClient.getInstance().query(ADD_PERSONEL_QUERY, [
				first_name,
				last_name,
				birth_date,
				email,
				await bcrypt.hash(password, 2),
				gender,
				hire_date,
			]);

			res.status(201).json({
				message: 'New Personel created',
				status: 201,
				data: rows,
			});

			await sendEmail(
				createConfirmationEmailContent(
					email,
					await createConfirmationUrl(rows[0].id),
				),
			);
		} catch (err) {
			next(
				new createHttpError.BadRequest(
					'Invalid values to create a personel.',
				),
			);
		}
	},
);

router.get(
	'/verify/:token',
	validateVerifyToken,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const key = `${CONFIRM_USER_PREFIX}${req.params.token}`;

			const userId = await RedisClient.getInstance().get(key);

			if (!userId) {
				return res.status(400).json({
					message: 'Could not verify email',
					status: 400,
				});
			}

			await Promise.all([
				DatabaseClient.getInstance().query(VERIFY_PERSONEL_EMAIL, [
					userId,
				]),
				RedisClient.getInstance().del(key),
			]);

			res.json({
				status: 200,
				message: 'Email successfully verified',
			});
		} catch (error) {
			console.error(error);
			next(new createHttpError.BadRequest('Bad Request'));
		}
	},
);

router.get(
	'/verify',
	auth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json({
				message: 'Verification email has been sent',
				status: 200,
			});

			await sendEmail(
				createConfirmationEmailContent(
					req.session.context.email,
					await createConfirmationUrl(req.session.context.id),
				),
			);
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.put(
	'/:id',
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const {
				first_name,
				last_name,
				email,
				birth_date,
				gender,
			} = req.body;

			await DatabaseClient.getInstance().query(UPDATE_PERSONEL_BY_ID, [
				first_name,
				last_name,
				email,
				birth_date,
				gender,
				req.params.id,
			]);

			res.status(204).send();
		} catch (error) {
			console.log(error);
			next(
				new createHttpError.BadRequest(
					'Invalid values to update a personel.',
				),
			);
		}
	},
);

export { router as personelRouter };
