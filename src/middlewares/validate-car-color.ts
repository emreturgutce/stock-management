import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCarColor = [
    body('name')
        .trim()
        .isAlpha('tr-TR')
        .isLength({ min: 2, max: 15 })
        .withMessage('Car color must be valid'),
    validateRequest,
];
