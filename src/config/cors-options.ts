import { FRONTEND_URL } from '.';

export const corsOptions = {
	origin: FRONTEND_URL || 'http://localhost:3000',
	credentials: true,
};
