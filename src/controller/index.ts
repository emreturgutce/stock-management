import { Router } from 'express';
import { carRouter } from './cars';
import { customerRouter } from './customers';
import { personelRouter } from './personel';
import { saleRouter } from './sales';
import { supplierRouter } from './suppliers';

const router = Router();

router.use('/personels', personelRouter);
router.use('/suppliers', supplierRouter);
router.use('/cars', carRouter);
router.use('/customers', customerRouter);
router.use('/sales', saleRouter);

export { router as indexRouter };
