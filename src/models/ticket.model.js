const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
