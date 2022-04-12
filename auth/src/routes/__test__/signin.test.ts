import request from 'supertest';
import {app} from "../../app";

it('Signin with not existing email', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(400);
});


it('Signin with invalid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'AAAAA'
        })
        .expect(400);
});

it('Signin with valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'secret'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
