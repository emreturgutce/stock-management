import { body } from 'express-validator';
import { validateRequest } from './validate-request';

export const validateCar = [
    body('title')
        .trim()
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage('Car Title must be valid'),
    body('sale_price')
        .isFloat({ min: 0 })
        .withMessage('Sale price must be valid'),
    body('purchase_price')
        .isFloat({ min: 0 })
        .withMessage('Purchase price must be valid'),
    body('is_sold')
        .matches(/\b(?:SOLD|NOTSOLD)\b/)
        .withMessage('Is sold must be valid'),
    body('description').isString().withMessage('Description must be valid'),
    body('model')
        .isString()
        .isLength({ min: 2, max: 50 })
        .withMessage('Model must be valid'),
    body('year')
        .isInt({ min: 1900, max: 2030 })
        .withMessage('Year must be valid'),
    body('is_new')
        .matches(/\b(?:NEW|NOT NEW)\b/)
        .withMessage('Is new must be valid'),
    body('enter_date').isString().withMessage('Enter Date must be valid'),
    body('supplier_id').isUUID('4').withMessage('Model must be valid'),
    body('personel_id').isUUID('4').withMessage('Model must be valid'),
    body('car_manufacturer_id').isUUID('4').withMessage('Model must be valid'),
    body('car_color_code').isUUID('4').withMessage('Model must be valid'),
    validateRequest,
];
