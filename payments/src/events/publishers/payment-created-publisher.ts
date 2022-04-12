import {PaymentCreatedEvent, Publisher, Subjects} from "@sudo-invoker/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
