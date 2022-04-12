import {Listener, Subjects, OrderCreatedEvent} from "@sudo-invoker/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {Ticket} from "../../models/ticket";
import {TicketUpdatedPublisher} from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({orderId: data.id});

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            userId: ticket.userId,
            title: ticket.title,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        msg.ack();

    }

}
