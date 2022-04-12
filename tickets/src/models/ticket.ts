import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    orderId?: string,
    created: number;
    version: number
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes) :TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        orderId: {
            type: String
        },
        created: {
            type: Number,
            required: true
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    let ticket = new Ticket(attributes);
    ticket.created = Math.round(Date.now() / 1000);
    return ticket;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
