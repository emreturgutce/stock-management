import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateSale = [
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
    body('serial_number')
        .trim()
        .isInt({ min: 0 })
        .withMessage('Sale serial number be valid'),
    body('price')
        .trim()
        .isInt({ min: 0 })
        .withMessage('Sale price must be valid'),
    body('personel_id').isUUID('4').withMessage('Personel id must be valid'),
    body('car_id').isUUID('4').withMessage('Car id must be valid'),
    body('sale_date').isString().withMessage('Sale date must be valid'),
    validateRequest,
];
