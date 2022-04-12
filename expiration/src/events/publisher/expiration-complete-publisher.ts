import {Publisher, Subjects, ExpirationCompleteEvent} from "@sudo-invoker/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {

    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

}
