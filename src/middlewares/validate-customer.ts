import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCustomer = [
    body('first_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Customer first name must be valid'),
    body('last_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Customer last name must be valid'),
    body('birth_date')
        .isString()
        .withMessage('Customer birth date must be valid'),
    validateRequest,
];
