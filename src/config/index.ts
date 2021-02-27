import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
	process.env.POSTGRES_DB = 'stock_management_test';
}

if (process.env.NODE_ENV === 'production') {
	const tag = process.env.REDIS_URL?.match(/(.*):\/\/(.*?):(.*)@(.*):(.*)/);

	if (tag) {
		process.env.REDIS_USER = tag[2];
		process.env.REDIS_PASSWORD = tag[3];
		process.env.REDIS_HOST = tag[4];
		process.env.REDIS_PORT = tag[5];
	}
}

export const {
	NODE_ENV,
	SESSION_SECRET,
	REDIS_HOST,
	REDIS_PORT,
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
export * from './redis';
export * from './database';
export * from './s3';
export * from './session';
export * from './cors-options';
