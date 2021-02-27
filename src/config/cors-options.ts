import { FRONTEND_URL, AWS_S3_BUCKET } from '.';

export const corsOptions = {
	origin: [
		FRONTEND_URL || 'http://localhost:3000',
		`https://${AWS_S3_BUCKET}.s3-eu-west-1.amazonaws.com`,
	],
	credentials: true,
};
