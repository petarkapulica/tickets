import request from 'supertest';
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";
import {OrderStatus} from "@sudo-invoker/common";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";

it('cancels order', async () => {

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
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .set('SuperTest', 'true')
        .send()
        .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('publishes an order deleted event', async () => {

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
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .set('SuperTest', 'true')
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

});
