import {ExpirationCompleteListener} from "../expiration-complete-listener";
import mongoose from "mongoose";
import {ExpirationCompleteEvent, OrderStatus} from "@sudo-invoker/common";
import {natsWrapper} from "../../../nats-wrapper";
import {Message} from 'node-nats-streaming';
import {Ticket} from "../../../models/ticket";
import {Order} from "../../../models/order";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 50,
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'd23f23',
        expiresAt: new Date(),
        ticket
    })

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, order, ticket, data, msg};
};

it('updates order status to cancelled', async () => {
    const {listener, order, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('publishes order cancelled event', async () => {
    const {listener, order, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id);

});

it('acks the message', async () => {
    const {listener, order, ticket, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});
