import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCarManufacturer = [
    body('name')
        .trim()
        .isAlpha('tr-TR')
        .isLength({ min: 2, max: 15 })
        .withMessage('Car manufacturer must be valid'),
    validateRequest,
];
