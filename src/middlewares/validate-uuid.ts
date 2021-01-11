import { check } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateUUID = [
    check('id').isUUID().withMessage('UUID must be valid'),
    validateRequest,
];
