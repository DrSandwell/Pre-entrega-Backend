const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true },
},{ timestamps: true, versionKey: false } );

module.exports = mongoose.model('Ticket', ticketSchema);

