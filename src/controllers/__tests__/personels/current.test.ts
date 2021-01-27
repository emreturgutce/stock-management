import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../app';
import { loginUser, user } from '../../../test/login-user';

describe('/api/personels/current tests', () => {
    it('Should return 200 OK for valid cookie', async () => {
        const response = await request(app)
            .get('/api/personels/current')
            .set('Cookie', await loginUser(user))
            .send()
            .expect(200);

        expect(response).not.to.be.empty;
        expect(response.body.data[0]).to.have.property('id');
        expect(response.body.data[0]).to.have.property('email');
        expect(response.body.data[0]).to.have.property('password');
        expect(response.body.data[0].email).to.be.equals(user.email);
        expect(response.body.data[0].password).not.to.be.equals(user.password);
    });

    it('Should return 401 Bad Request without cookie', async () => {
        await request(app).get('/api/personels/current').send().expect(401);
    });

    it('Should return 401 Bad Request with invalid cookie', async () => {
        await request(app)
            .get('/api/personels/current')
            .set('Cookie', 'invalidcookie')
            .send()
            .expect(401);
    });
});
