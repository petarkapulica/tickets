import request from 'supertest';
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

it('fetches order', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    const user = global.signin();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .set('SuperTest', 'true')
        .send({ticketId: ticket.id})
        .expect(201);

    const {body: fetchedOrder} =  await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .set('SuperTest', 'true')
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);

});


it('returns error if one user try to fetch other users order', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    const user = global.signin();

    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .set('SuperTest', 'true')
        .send({ticketId: ticket.id})
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send()
        .expect(401);

});
