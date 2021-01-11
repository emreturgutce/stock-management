import { Router } from 'express';
import { auth, errorHandler, notFound } from '../middlewares';
import { carRouter } from './cars';
import { customerRouter } from './customers';
import { personelRouter } from './personels';
import { saleRouter } from './sales';
import { supplierRouter } from './suppliers';

const router = Router();

router.use('/api/personels', personelRouter);
router.use('/api/suppliers', auth, supplierRouter);
router.use('/api/cars', auth, carRouter);
router.use('/api/customers', auth, customerRouter);
router.use('/api/sales', auth, saleRouter);

router.use(notFound);
router.use(errorHandler);

export { router as indexRouter };
