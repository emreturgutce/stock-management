import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { DatabaseClient } from '../config';
import { validateSupplier, validateUUID } from '../middlewares';
import {
    ADD_SUPPLIER_QUERY,
    GET_SUPPLIERS_QUERY,
    GET_SUPPLIER_BY_ID_QUERY,
} from '../queries';

const router = Router();

router.post(
    '/',
    validateSupplier,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { first_name, last_name, birth_date } = req.body;
            const {
                rows,
            } = await DatabaseClient.getInstance().query(ADD_SUPPLIER_QUERY, [
                first_name,
                last_name,
                birth_date,
            ]);

            res.status(201).json({
                message: 'New supplier created',
                status: 201,
                data: rows,
            });
        } catch (err) {
            next(
                new createHttpError.BadRequest(
                    'Invalid values to create a supplier.',
                ),
            );
        }
    },
);

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await DatabaseClient.getInstance().query(
            GET_SUPPLIERS_QUERY,
        );

        res.json({
            message: 'Suppliers fetched',
            status: 200,
            data: rows,
        });
    } catch (error) {
        next(new createHttpError.InternalServerError('Internal Server Error'));
    }
});

router.get(
    '/:id',
    validateUUID,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const {
                rows,
            } = await DatabaseClient.getInstance().query(
                GET_SUPPLIER_BY_ID_QUERY,
                [id],
            );

            if (rows.length === 0) {
                return next(
                    new createHttpError.NotFound(
                        'Supplier not found with the given id',
                    ),
                );
            }

            res.json({
                message: 'Supplier fetched with the given id',
                status: 200,
                data: rows,
            });
        } catch (error) {
            next(new createHttpError.BadRequest('Bad Request'));
        }
    },
);

export { router as supplierRouter };
