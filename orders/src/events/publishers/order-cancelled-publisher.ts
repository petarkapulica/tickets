import {OrderCancelledEvent, Publisher, Subjects} from "@sudo-invoker/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
