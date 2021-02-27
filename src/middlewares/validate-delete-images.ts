import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateDeleteImages = [
	body('images')
		.isArray({ min: 1 })
		.withMessage('Length of images array cannot be less than 1'),
	validateRequest,
];
