import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import {natsWrapper} from "../../nats-wrapper";

it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
});

it('returns response if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns and error if invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            price: 10
        })
        .expect(400);
});

it('returns and error if invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: 'test',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: 'test'
        })
        .expect(400);
});

it('creates a valid ticket', async () => {

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: 'test',
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
});

it('publishes an event', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            title: 'test',
            price: 20
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
