import { Router } from 'express';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import { AWS_S3_BUCKET, DatabaseClient } from '../config';
import { uploadAvatar } from '../middlewares';
import {
    ADD_CAR_COLOR_QUERY,
    ADD_CAR_IMAGE,
    ADD_CAR_MANUFACTURER_QUERY,
    ADD_CAR_QUERY,
    DELETE_CAR_BY_ID,
    GET_CARS_QUERY_NEW,
    GET_CAR_BY_ID_QUERY,
    GET_CAR_COLORS_QUERY,
    GET_CAR_IMAGES_BY_ID,
    GET_CAR_MANUFACTURER_QUERY,
    UPDATE_CAR_BY_ID,
} from '../queries';
import { uploadAvatarToS3 } from '../utils';

const router = Router();

router.post('/colors', async (req, res, next) => {
    try {
        const { name } = req.body;
        const {
            rows,
        } = await DatabaseClient.getInstance().query(ADD_CAR_COLOR_QUERY, [
            name.toUpperCase(),
        ]);

        res.status(201).json({
            message: 'New car color added',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest('Invalid values to create a color.'),
        );
    }
});

router.get('/colors', async (req, res) => {
    const { rows } = await DatabaseClient.getInstance().query(
        GET_CAR_COLORS_QUERY,
    );

    res.json({ message: 'Car colors fetched', status: 200, data: rows });
});

router.post('/manufacturers', async (req, res, next) => {
    try {
        const { name } = req.body;
        const {
            rows,
        } = await DatabaseClient.getInstance().query(
            ADD_CAR_MANUFACTURER_QUERY,
            [name.toUpperCase()],
        );

        res.status(201).json({
            message: 'New car manifacturer added',
            status: 201,
            data: rows,
        });
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid values to create a manufacturer.',
            ),
        );
    }
});

router.get('/manufacturers', async (req, res) => {
    const { rows } = await DatabaseClient.getInstance().query(
        GET_CAR_MANUFACTURER_QUERY,
    );

    res.json({ message: 'Car manufacturers fetched', status: 200, data: rows });
});

router.post('/', uploadAvatar, async (req, res, next) => {
    try {
        await DatabaseClient.getInstance().query('BEGIN');

        const {
            title,
            sale_price,
            purchase_price,
            is_sold,
            description,
            model,
            year,
            is_new,
            enter_date,
            supplier_id,
            personel_id,
            car_manufacturer_id,
            car_color_code,
        } = req.body;

        const carRes = await DatabaseClient.getInstance().query(ADD_CAR_QUERY, [
            title,
            sale_price,
            purchase_price,
            is_sold,
            description,
            model,
            year,
            is_new,
            enter_date,
            supplier_id,
            personel_id,
            car_manufacturer_id,
            car_color_code,
        ]);

        if (req.file) {
            const extension = req.file.originalname.split('.')[1];

            const avatarId = `${uuid()}.${extension}`;

            const imageURL = `https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${avatarId}`;

            const uploadAvatarPromise = uploadAvatarToS3(
                avatarId,
                req.file.buffer,
            );

            const addCarImagePromise = DatabaseClient.getInstance().query(
                ADD_CAR_IMAGE,
                [imageURL, carRes.rows[0].car_id],
            );

            await Promise.all([uploadAvatarPromise, addCarImagePromise]);
        }

        await DatabaseClient.getInstance().query('COMMIT');

        res.status(201).json({
            message: 'New car created',
            status: 201,
            data: carRes.rows,
        });
    } catch (err) {
        await DatabaseClient.getInstance().query('ROLLBACK');
        next(
            new createHttpError.BadRequest(
                'Invalid credentials to create a car.',
            ),
        );
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const {
            title,
            sale_price,
            purchase_price,
            description,
            model,
            year,
            is_new,
            enter_date,
            supplier_id,
            car_manufacturer_id,
            car_color_code,
        } = req.body;

        await DatabaseClient.getInstance().query(UPDATE_CAR_BY_ID, [
            title,
            description,
            sale_price,
            purchase_price,
            enter_date,
            year,
            model,
            is_new,
            car_color_code,
            car_manufacturer_id,
            supplier_id,
            req.params.id,
        ]);

        res.status(204).send();
    } catch (err) {
        next(
            new createHttpError.BadRequest(
                'Invalid credentials to update a car.',
            ),
        );
    }
});

router.get('/', async (req, res) => {
    const { rows } = await DatabaseClient.getInstance().query(
        GET_CARS_QUERY_NEW,
    );

    res.json({ message: 'Cars fetched', status: 200, data: rows });
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    const {
        rows,
    } = await DatabaseClient.getInstance().query(GET_CAR_BY_ID_QUERY, [id]);

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound(`Car not found with the id of ${id}`),
        );
    }

    res.json({
        message: 'Car fetched with the given id.',
        status: 200,
        data: rows,
    });
});

router.get('/:id/images', async (req, res, next) => {
    const {
        rows,
    } = await DatabaseClient.getInstance().query(GET_CAR_IMAGES_BY_ID, [
        req.params.id,
    ]);

    if (rows.length === 0) {
        return next(new createHttpError.NotFound('No image found'));
    }

    res.json({
        message: 'All car images fetched with the given id.',
        status: 200,
        data: rows,
    });
});

router.post('/:id/images', uploadAvatar, async (req, res, next) => {
    if (!req.file) {
        return next(new createHttpError.BadRequest('Please upload a file'));
    }

    const extension = req.file.originalname.split('.')[1];

    const avatarId = `${uuid()}.${extension}`;

    const imageURL = `https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com/${avatarId}`;

    try {
        await uploadAvatarToS3(avatarId, req.file.buffer);

        await DatabaseClient.getInstance().query(ADD_CAR_IMAGE, [
            imageURL,
            req.params.id,
        ]);

        res.json({ message: 'Image saved', status: 200 });
    } catch (err) {
        next(new createHttpError.BadRequest('Not valid image'));
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    const { rows } = await DatabaseClient.getInstance().query(
        DELETE_CAR_BY_ID,
        [id],
    );

    if (rows.length === 0) {
        return next(
            new createHttpError.NotFound(`Car not found with the id of ${id}`),
        );
    }

    res.json({
        message: 'Car deleted with the given id.',
        status: 200,
        data: rows,
    });
});

export { router as carRouter };
