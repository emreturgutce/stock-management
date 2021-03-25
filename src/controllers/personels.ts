import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import geoip from 'geoip-lite';
import {
	DatabaseClient,
	cookieOptions,
	RedisClient,
	FRONTEND_URL,
} from '../config';
import {
	ADD_ADMIN_PERSONEL_QUERY,
	ADD_PERSONEL_QUERY,
	CHANGE_PASSWORD,
	CHECK_IF_PERSONEL_EXISTS_WITH_THE_EMAIL,
	DELETE_PERSONEL_BY_ID,
	DROP_PERSONEL_ROLE,
	ENHANCE_PERSONEL_ROLE,
	GET_PERSONELS_QUERY,
	GET_PERSONEL_BY_EMAIL,
	GET_PERSONEL_BY_ID,
	UPDATE_PERSONEL_BY_ID,
	VERIFY_PERSONEL_EMAIL,
} from '../queries';
import {
	auth,
	validateLogin,
	validatePersonel,
	validateUUID,
	validateVerifyToken,
	validateChangePassword,
	validateChangeForgottenPassword,
	validateForgotEmail,
	authAdmin,
} from '../middlewares';
import {
	CONFIRM_USER_PREFIX,
	COOKIE_NAME,
	FORGOT_PASSWORD_PREFIX,
	LAST_LOGIN_PREFIX,
} from '../constants';
import {
	sendEmail,
	createConfirmationUrl,
	createConfirmationEmailContent,
	createForgotPasswordEmailContent,
} from '../utils';

const router = Router();

router.post(
	'/login',
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

			const lastLogin = Date.now();

			req.session.context = {
				id: rows[0].id,
				verified: rows[0].verified,
				email: rows[0].email,
				role: rows[0].role,
				lastLogin,
			};

			delete rows[0].password;

			await RedisClient.addToSet(
				`${LAST_LOGIN_PREFIX}${rows[0].id}`,
				JSON.stringify({
					geo: geoip.lookup(req.ip),
					ip: req.ip,
					lastLogin,
					sessionId: req.sessionID,
					agent: req.headers['user-agent'],
				}),
				req.sessionID,
			);

			rows[0].lastLogins = (
				await RedisClient.getFromSet(
					`${LAST_LOGIN_PREFIX}${rows[0].id}`,
				)
			).map((lastLogin) => JSON.parse(lastLogin));

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

router.get(
	'/expire-session/:id', // id of the user
	validateUUID,
	authAdmin,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const deletedSessionNumber = await RedisClient.deleteAllSessionOfAUser(
				req.params.id,
			);

			res.json({
				message: 'All session of the user has been deleted',
				status: 200,
				data: {
					deletedSessionNumber,
				},
			});
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.get('/', authAdmin, async (req, res, next) => {
	try {
		const {
			rows,
		} = await DatabaseClient.getInstance().query(GET_PERSONELS_QUERY, [
			req.session.context.id,
		]);

		for (let i = 0; i < rows.length; i++) {
			rows[i].lastLogins = (
				await RedisClient.getFromSet(
					`${LAST_LOGIN_PREFIX}${rows[i].id}`,
				)
			).map((lastLogin) => JSON.parse(lastLogin));
		}

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

		rows[0].lastLogins = (
			await RedisClient.getFromSet(
				`${LAST_LOGIN_PREFIX}${req.session.context.id}`,
			)
		).map((lastLogin) => JSON.parse(lastLogin));

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
	authAdmin,
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
				role,
			} = req.body;

			const values = [
				first_name,
				last_name,
				birth_date,
				email,
				await bcrypt.hash(password, 2),
				gender,
				hire_date,
			];

			const { rows } = await DatabaseClient.getInstance().query(
				role ? ADD_ADMIN_PERSONEL_QUERY : ADD_PERSONEL_QUERY,
				role ? [...values, role] : values,
			);

			res.status(201).json({
				message: 'New Personel created',
				status: 201,
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
	auth,
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

			req.session.context.verified = true;

			res.json({
				status: 200,
				message: 'Email successfully verified',
			});
		} catch (error) {
			next(new createHttpError.BadRequest('Bad Request'));
		}
	},
);

router.get(
	'/verify',
	auth,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (req.session.context.verified) {
				return next(
					new createHttpError.BadRequest('Email is already verified'),
				);
			}

			await sendEmail(
				createConfirmationEmailContent(
					req.session.context.email,
					await createConfirmationUrl(req.session.context.id),
				),
			);

			res.json({
				message: 'Verification email has been sent',
				status: 200,
			});
		} catch (error) {
			console.log(error);
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.post(
	'/forgot-password',
	validateForgotEmail,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { email } = req.body;

			const {
				rows,
			} = await DatabaseClient.getInstance().query(
				CHECK_IF_PERSONEL_EXISTS_WITH_THE_EMAIL,
				[email],
			);

			if (rows.length === 0) {
				return next(
					new createHttpError.NotFound(
						'User not found with the given email',
					),
				);
			}
			res.json({
				status: 200,
				message: 'Forgot password email sent',
			});

			const token = uuid();

			await Promise.all([
				RedisClient.getInstance().set(
					`${FORGOT_PASSWORD_PREFIX}${token}`,
					rows[0].id,
					'ex',
					60 * 5,
				),
				sendEmail(
					createForgotPasswordEmailContent(
						email,
						`${FRONTEND_URL}/user/change-password/${token}`,
					),
				),
			]);
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.post(
	'/change-password/:token',
	validateChangeForgottenPassword,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { token } = req.params;

			const id = await RedisClient.getInstance().get(
				`${FORGOT_PASSWORD_PREFIX}${token}`,
			);

			if (!id) {
				return next(new createHttpError.BadRequest('Bad request'));
			}

			await Promise.all([
				DatabaseClient.getInstance().query(CHANGE_PASSWORD, [
					await bcrypt.hash(req.body.password, 2),
					id,
				]),
				RedisClient.getInstance().del(
					`${FORGOT_PASSWORD_PREFIX}${token}`,
				),
			]);

			res.status(204).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.post(
	'/change-password',
	auth,
	validateChangePassword,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.session.context.verified) {
				return next(
					new createHttpError.BadRequest(
						'Email must be verified to change password',
					),
				);
			}

			await DatabaseClient.getInstance().query(CHANGE_PASSWORD, [
				await bcrypt.hash(req.body.password, 2),
				req.session.context.id,
			]);

			res.status(204).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.put(
	'/current',
	auth,
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
				req.session.context.id,
			]);

			req.session.context.email = email;

			res.status(204).send();
		} catch (error) {
			next(
				new createHttpError.BadRequest(
					'Invalid values to update a personel.',
				),
			);
		}
	},
);

router.get(
	'/:id/role-enhance',
	authAdmin,
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await DatabaseClient.getInstance().query(
				ENHANCE_PERSONEL_ROLE,
				[req.params.id],
			);

			if (result.rowCount > 0) {
				return res.status(204).send();
			}

			res.status(304).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.get(
	'/:id/role-drop',
	authAdmin,
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const result = await DatabaseClient.getInstance().query(
				DROP_PERSONEL_ROLE,
				[req.params.id],
			);

			if (result.rowCount > 0) {
				return res.status(204).send();
			}

			res.status(304).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

router.put(
	'/:id',
	authAdmin,
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
			next(
				new createHttpError.BadRequest(
					'Invalid values to update a personel.',
				),
			);
		}
	},
);

router.delete(
	'/:id',
	authAdmin,
	validateUUID,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await DatabaseClient.getInstance().query(DELETE_PERSONEL_BY_ID, [
				req.params.id,
			]);

			res.status(204).send();
		} catch (error) {
			next(
				new createHttpError.InternalServerError('Something went wrong'),
			);
		}
	},
);

export { router as personelRouter };
