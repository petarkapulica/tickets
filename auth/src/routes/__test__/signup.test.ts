import request from 'supertest';
import {app} from "../../app";

it('Signup success', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(201);
});

it('Signup with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'invalid',
            password: 'secret'
        })
        .expect(400);
});

it('Signup with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1'
        })
        .expect(400);
});

it('Signup with no data', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('Signup with existing email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(400);
});

it('Signup test cookie', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
