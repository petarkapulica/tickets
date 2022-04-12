import {Publisher, Subjects, TicketCreatedEvent} from "@sudo-invoker/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {

    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}
