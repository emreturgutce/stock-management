import { Router } from 'express';
import { auth } from '../middleware/auth';
import { carRouter } from './cars';
import { customerRouter } from './customers';
import { personelRouter } from './personel';
import { saleRouter } from './sales';
import { supplierRouter } from './suppliers';

const router = Router();

router.use('/personels', personelRouter);
router.use('/suppliers', auth, supplierRouter);
router.use('/cars', auth, carRouter);
router.use('/customers', auth, customerRouter);
router.use('/sales', auth, saleRouter);

export { router as indexRouter };
