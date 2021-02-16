import { check } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateVerifyToken = [
    check('token').isUUID().withMessage('Token must be valid'),
    validateRequest,
];

