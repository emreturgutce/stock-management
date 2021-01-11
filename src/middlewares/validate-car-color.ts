import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCarColor = [
    body('name').trim().isAlpha('tr-TR').withMessage('Car color must be valid'),
    validateRequest,
];
