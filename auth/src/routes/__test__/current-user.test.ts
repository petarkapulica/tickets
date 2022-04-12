import request from 'supertest';
import {app} from "../../app";

it('Get auth user data', async () => {
   const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send({})
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('Get auth user data if not authenticated', async () => {

    await request(app)
        .get('/api/users/currentuser')
        .send({})
        .expect(401);

});
