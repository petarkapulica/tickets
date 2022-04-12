import {OrderCancelledListener} from "../order-cancelled-listener";
import {OrderCancelledEvent} from "@sudo-invoker/common";
import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import {Message} from 'node-nats-streaming';
import {Ticket} from "../../../models/ticket";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: 'r32r32',
    });
    ticket.set({orderId});

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        },
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {listener, data, msg, ticket, orderId};
};

it('updates ticket, publishes event and acks the message', async () => {
    const {listener, data, msg, ticket} = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
