import {Publisher, Subjects, TicketUpdatedEvent} from "@sudo-invoker/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {

    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

}
