import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV must be defined');
}

if (!process.env.SESSION_SECRET) {
    throw new Error('NODE_ENV must be defined');
}

if (!process.env.REDIS_HOST) {
    throw new Error('REDIS_HOST must be defined');
}

if (!process.env.REDIS_PORT) {
    throw new Error('REDIS_PORT must be defined');
}

if (!process.env.JWT_SECRET) {
    throw new Error('REDIS_PORT must be defined');
}

if (!process.env.PORT) {
    throw new Error('PORT must be defined');
}

if (!process.env.POSTGRES_USER) {
    throw new Error('POSTGRES_USER must be defined');
}

if (!process.env.POSTGRES_PASSWORD) {
    throw new Error('POSTGRES_PASSWORD must be defined');
}

if (!process.env.POSTGRES_HOST) {
    throw new Error('POSTGRES_HOST must be defined');
}

if (!process.env.POSTGRES_PORT) {
    throw new Error('POSTGRES_PORT must be defined');
}

if (!process.env.POSTGRES_DB) {
    throw new Error('POSTGRES_DB must be defined');
}

if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID must be defined');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY must be defined');
}

if (!process.env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET must be defined');
}

if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS_PASSWORD must be defined');
}

export const {
    NODE_ENV,
    SESSION_SECRET,
    REDIS_HOST,
    REDIS_PORT,
    JWT_SECRET,
    PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DB,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET,
    REDIS_PASSWORD,
} = process.env;
export { redis } from './redis';
