import request from 'supertest';
import mongoose from "mongoose";
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";
import {OrderStatus} from "@sudo-invoker/common";
import {natsWrapper} from "../../nats-wrapper";

it('returns error if ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({ticketId})
        .expect(404);
});


it('returns error if ticket is already reserved', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: 'fsdfsfdsfdsfsd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({ticketId: ticket.id})
        .expect(400);

});

it('returns a ticket successfully', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({ticketId: ticket.id})
        .expect(201);

});

it('publishes an order created event', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({ticketId: ticket.id})
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

});
