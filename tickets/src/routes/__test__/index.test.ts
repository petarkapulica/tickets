import request from 'supertest';
import {app} from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: 'concert',
            price: 150
        })
        .expect(201);
}

it('fetches list of tickets', async () => {

    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});
