import dotenv from 'dotenv';

dotenv.config();

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
    FRONTEND_URL,
} = process.env;
export { RedisClient } from './redis';
