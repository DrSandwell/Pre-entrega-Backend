const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;