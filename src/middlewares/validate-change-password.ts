import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateChangePassword = [
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
