import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateForgotEmail = [
	body('email')
		.trim()
		.isString()
		.isLength({
			min: 0,
			max: 255,
		})
		.withMessage('Email must be valid'),
	validateRequest,
];
