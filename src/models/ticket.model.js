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
},{ timestamps: true, versionKey: false } );

module.exports =mongoose.model('Ticket', ticketSchema);

