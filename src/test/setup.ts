import request from 'supertest';
import { app } from '../app';

before(async () => {
    await request(app).post('/api/personels').send({
        first_name: 'emre',
        last_name: 'turgut',
        birth_date: '2000-06-23',
        email: 'emreturgut@mail.com',
        password: '123456',
        gender: 'MALE',
        hire_date: '2021-01-11',
    });
});
