import { body, check } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateChangeForgottenPassword = [
	check('token').isUUID().withMessage('Token must be valid'),
	body('password')
		.trim()
		.isString()
		.isLength({
			min: 0,
			max: 255,
		})
		.withMessage('Password must be valid'),
	validateRequest,
];
