import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCarManufacturer = [
    body('name')
        .trim()
        .isAlpha('tr-TR')
        .withMessage('Car manufacturer must be valid'),
    validateRequest,
];
