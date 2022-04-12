import request from 'supertest';
import {app} from "../../app";
import {Order} from "../../models/order";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();
    return ticket;
}

it('fetches orders for user', async () => {

    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    //1 order as user1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .set('SuperTest', 'true')
        .send({ticketId: ticketOne.id})
        .expect(201);

    //2 orders as user2
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .set('SuperTest', 'true')
        .send({ticketId: ticketTwo.id})
        .expect(201);
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .set('SuperTest', 'true')
        .send({ticketId: ticketThree.id})
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .set('SuperTest', 'true')
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);

});
