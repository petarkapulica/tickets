import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
}); //stan is nats naming convention

stan.on('connect', async () => {
    console.log('pub connected to nats');

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: '444',
            title: 'concert',
            price: 30
        })
    } catch (e) {
        console.error(e);
    }

});
