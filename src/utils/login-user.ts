import request from 'supertest';
import { app } from '../app';

export const loginUser = async (user: User) => {
    const response = await request(app)
        .post('/api/personels/login')
        .send(user)
        .expect(200);

    const cookie = response.get('Set-Cookie');

    return cookie;
};
