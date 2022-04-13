import request from 'supertest';
import mongoose from "mongoose";
import {app} from "../../app";
import {Order} from "../../models/order";
import {Payment} from "../../models/payment";
import {OrderStatus} from "@sudo-invoker/common";
import {stripe} from "../../stripe";

jest.mock('../../stripe');

it('returns 404 if order does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            token: 'f3f4',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});


it('returns 401 if invalid user', async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 100,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .set('SuperTest', 'true')
        .send({
            token: 'f3f4',
            orderId: order.id
        })
        .expect(401);

});

it('returns 400 when order is cancelled', async () => {

    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 100,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .set('SuperTest', 'true')
        .send({
            token: 'f3f4',
            orderId: order.id
        })
        .expect(400);
});

it('returns 204 with valid payment', async () => {

    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 100,
        status: OrderStatus.Created
    });

    await order.save();

    // await request(app)
    //     .post('/api/payments')
    //     .set('Cookie', global.signin(userId))
    //     .set('SuperTest', 'true')
    //     .send({
    //         token: 'tok_visa',
    //         orderId: order.id
    //     })
    //     .expect(201);
    //
    // const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    //
    // expect(chargedOptions.source).toEqual('tok_visa');
    // expect(chargedOptions.amount).toEqual(10000);
    // expect(chargedOptions.currency).toEqual('usd');
    //
    // const payment = Payment.findOne({
    //     orderId: order.id
    // })
    //
    // expect(payment).not.toBeNull();
});
