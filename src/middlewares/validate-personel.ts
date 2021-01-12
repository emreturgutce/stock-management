import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validatePersonel = [
    body('first_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Personel first name must be valid'),
    body('last_name')
        .trim()
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Personel last name must be valid'),
    body('birth_date')
        .isString()
        .withMessage('Personel birth date must be valid'),
    body('email')
        .trim()
        .isString()
        .isLength({ min: 5, max: 255 })
        .withMessage('Personel email must be valid'),
    body('password')
        .trim()
        .isString()
        .isLength({ min: 4, max: 255 })
        .withMessage('Personel password must be valid'),
    body('gender')
        .matches(/\b(?:MALE|FEMALE)\b/)
        .withMessage('Personel gender must be valid'),
    body('hire_date')
        .isString()
        .withMessage('Personel hire date must be valid'),
    validateRequest,
];
