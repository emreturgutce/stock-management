import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../app';
import { loginUser, user } from '../../../test/login-user';

describe('/api/suppliers tests', () => {
    it('Should return 200 OK for valid cookie', async () => {
        const response = await request(app)
            .get('/api/suppliers')
            .set('Cookie', await loginUser(user))
            .send()
            .expect(200);

        expect(response).not.to.be.empty;
    });

    it.only('Should return 401 Unauthorized for invalid cookie', async () => {
        const response = await request(app)
            .get('/api/suppliers')
            .set('Cookie', 'invalidcookie')
            .send()
            .expect(401);

        expect(response).not.to.be.empty;
    });
});
