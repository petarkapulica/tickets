import {Ticket} from "../ticket";

it('implements ooc', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: '123'
    });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({price: 100});
    secondInstance!.set({price: 200});

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('should not reach this point');

})

it('increments version number', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);

})
