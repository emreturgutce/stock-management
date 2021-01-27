import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../app';
import { user } from '../../../test/login-user';

const postPersonelsLogin = request(app).post('/api/personels/login');

describe('/api/personels/login tests', () => {
    it('Should return 400 Bad Request with no request body', async () => {
        await postPersonelsLogin.send(undefined).expect(400);
    });

    it('Should return 400 Bad Request without email', async () => {
        await postPersonelsLogin
            .send({
                password: user.password,
            })
            .expect(400);
    });

    it('Should return 400 Bad Request without password', async () => {
        await postPersonelsLogin
            .send({
                email: user.email,
            })
            .expect(400);
    });

    it('Should return 400 Bad Request without password', async () => {
        await postPersonelsLogin
            .send({
                email: user.email,
            })
            .expect(400);
    });

    it('Should return 400 Bad Request for invalid email', async () => {
        await postPersonelsLogin
            .send({
                email: 'notavalidemail',
                password: user.password,
            })
            .expect(400);
    });

    it('Should return 400 Bad Request for password less than 4 chars', async () => {
        await postPersonelsLogin
            .send({
                email: user.email,
                password: '123',
            })
            .expect(400);
    });

    it('Should return 401 Unauthorized for incorrect password', async () => {
        await postPersonelsLogin
            .send({
                email: user.email,
                password: 'incorrectpassword',
            })
            .expect(401);
    });

    it('Should return 401 Unauthorized for incorrect email', async () => {
        await postPersonelsLogin
            .send({
                email: 'incorrect@mail.com',
                password: user.password,
            })
            .expect(401);
    });

    it('Should return 401 Unauthorized for incorrect email and password', async () => {
        await postPersonelsLogin
            .send({
                email: 'incorrect@mail.com',
                password: 'incorrect',
            })
            .expect(401);
    });

    it('Should return 200 OK for valid credentials', async () => {
        const response = await request(app)
            .post('/api/personels/login')
            .send(user)
            .expect(200);

        expect(response).not.to.be.empty;
        expect(response.body).not.to.be.empty;
        expect(response.body.data[0]).to.have.property('id');
        expect(response.body.data[0]).to.have.property('email');
        expect(response.body.data[0]).to.have.property('password');
        expect(response.body.data[0].email).to.be.equal(user.email);
        expect(response.body.data[0].password).not.to.be.equal(user.password);
    });
});
