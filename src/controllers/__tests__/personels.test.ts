import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../app';

describe('/api/personels tests', () => {
    it('Should not log in a personel', async () => {
        await request(app).post('/api/personels/login').send().expect(400);
    });
});
