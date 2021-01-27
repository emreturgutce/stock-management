import request from 'supertest';
import { app } from '../app';

type User = {
	email: string;
	password: string;
};

export const loginUser = async (user: User) => {
	const response = await request(app)
		.post('/api/personels/login')
		.send(user)
		.expect(200);

	const cookie = response.get('Set-Cookie');

	return cookie;
};

export const user: User = {
	email: 'emreturgut@mail.com',
	password: '123456',
};
