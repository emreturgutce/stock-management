import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateSupplier = [
    body('first_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Supplier first name must be valid'),
    body('last_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Supplier last name must be valid'),
    body('birth_date')
        .isString()
        .withMessage('Supplier birth date must be valid'),
    validateRequest,
];
