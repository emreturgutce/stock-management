import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../app';
import { loginUser, user } from '../../../test/login-user';

describe('/api/cars tests', () => {
    it('Should return 200 OK for valid cookie', async () => {
        const response = await request(app)
            .get('/api/cars')
            .set('Cookie', await loginUser(user))
            .send()
            .expect(200);

        expect(response).not.to.be.empty;
        expect(response.body.data).to.be.an('array');
        expect(response.body.data[0]).to.have.property('id');
        expect(response.body.data[0]).to.have.property('title');
        expect(response.body.data[0]).to.have.property('sale_price');
        expect(response.body.data[0]).to.have.property('model');
        expect(response.body.data[0]).to.have.property('year');
        expect(response.body.data[0]).to.have.property('is_sold');
    });

    it('Should return 401 Bad Request without cookie', async () => {
        await request(app).get('/api/cars').send().expect(401);
    });

    it('Should return 401 Bad Request with invalid cookie', async () => {
        await request(app)
            .get('/api/cars')
            .set('Cookie', 'invalidcookie')
            .send()
            .expect(401);
    });

    it('Should return 200 OK for valid cookie', async () => {
        const cookie = await loginUser(user);

        const response = await request(app)
            .get('/api/cars')
            .set('Cookie', cookie)
            .send()
            .expect(200);

        const id = response.body.data[0].car_id;

        const carResponse = await request(app)
            .get(`/api/cars/${id}`)
            .set('Cookie', cookie)
            .send()
            .expect(200);

        expect(carResponse).not.to.be.empty;
        expect(carResponse.body.data[0].id).to.be.equals(id);
    });

    it('Should return 404 Not Found for car id which does not exist', async () => {
        const id = '040de1aa-546d-4e60-8e98-b4ce4d3f34c4';

        const carResponse = await request(app)
            .get(`/api/cars/${id}`)
            .set('Cookie', await loginUser(user))
            .send()
            .expect(404);

        expect(carResponse).not.to.be.empty;
        expect(carResponse.body.message).to.contain(id);
    });
});
