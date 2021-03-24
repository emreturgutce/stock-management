declare module 'express-session' {
	interface Session {
		context: {
			id: string;
			email: string;
			verified: boolean;
			role: 'PERSONEL' | 'ADMIN';
			lastLogin: number;
		};
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			SESSION_SECRET: string;
			REDIS_HOST: string;
			REDIS_PORT: string;
			REDIS_PASSWORD: string | undefined;
			PORT: string;
			POSTGRES_USER: string;
			POSTGRES_PASSWORD: string;
			POSTGRES_HOST: string;
			POSTGRES_PORT: string;
			POSTGRES_DB: string;
			AWS_ACCESS_KEY_ID: string;
			AWS_SECRET_ACCESS_KEY: string;
			AWS_S3_BUCKET: string;
		}
	}
	interface CookieOptions {
		sameSite: boolean | 'none' | 'strict' | 'lax' | undefined;
		secure: boolean;
		httpOnly: boolean;
		signed: boolean;
	}

	type User = {
		email: string;
		password: string;
	};
}

export {};
