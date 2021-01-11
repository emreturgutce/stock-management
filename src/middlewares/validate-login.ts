import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateLogin = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    validateRequest,
];
