import request from 'supertest';
import { app } from '../../../app';
import { loginUser, user } from '../../../test/login-user';

describe('/api/personels/logout tests', () => {
    it('Should return 204 No Content for valid cookie', async () => {
        await request(app)
            .get('/api/personels/logout')
            .set('Cookie', await loginUser(user))
            .send()
            .expect(204);
    });

    it('Should return 401 Bad Request without cookie', async () => {
        await request(app).get('/api/personels/logout').send().expect(401);
    });

    it('Should return 401 Bad Request with invalid cookie', async () => {
        await request(app)
            .get('/api/personels/logout')
            .set('Cookie', 'invalidcookie')
            .send()
            .expect(401);
    });
});
