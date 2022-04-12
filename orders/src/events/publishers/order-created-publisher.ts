import {OrderCreatedEvent, Publisher, Subjects} from "@sudo-invoker/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
