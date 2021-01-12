import request from 'supertest';
import faker from 'faker';
import { app } from '../../../app';
import { expect } from 'chai';

describe('POST /api/personels tests', () => {
    it('Should return 201 Created for valid request body', async () => {
        const gender = Math.floor(Math.random());
        const first_name = faker.name.firstName(gender);
        const last_name = faker.name.lastName(gender);
        const email = faker.internet.email(first_name, last_name);
        const password = faker.internet.password(6);

        const response = await request(app)
            .post('/api/personels')
            .send({
                first_name,
                last_name,
                birth_date: '2000-06-23',
                email,
                password,
                gender: gender === 0 ? 'MALE' : 'FEMALE',
                hire_date: '2021-01-12',
            })
            .expect(201);

        expect(response).not.to.be.empty;
        expect(response.body.message).to.equal('New Personel created');
        expect(response.body.status).to.equal(201);
        expect(response.body.data).to.be.an('array');
        expect(response.body.data).length(1);
        expect(response.body.data[0]).to.have.property('id');
        expect(response.body.data[0]).to.have.property('first_name');
        expect(response.body.data[0]).to.have.property('last_name');
        expect(response.body.data[0]).to.have.property('birth_date');
        expect(response.body.data[0]).to.have.property('email');
        expect(response.body.data[0]).to.have.property('password');
        expect(response.body.data[0]).to.have.property('gender');
        expect(response.body.data[0]).to.have.property('hire_date');
        expect(response.body.data[0]).to.have.property('created_at');
        expect(response.body.data[0]).to.have.property('updated_at');
        expect(response.body.data[0].first_name).to.equal(first_name);
        expect(response.body.data[0].last_name).to.equal(last_name);
        expect(response.body.data[0].email).to.equal(email);
        expect(response.body.data[0].password).not.to.equal(password);
        expect(response.body.data[0].gender).to.equal(
            gender === 0 ? 'MALE' : 'FEMALE',
        );
    });
});
