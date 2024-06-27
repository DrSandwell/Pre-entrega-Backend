const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'productos',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
},{ timestamps: true, versionKey: false } );

cartSchema.pre('findOne', function (next) {
    this.populate('products.product', '_id title price');
    next();
});

module.exports = mongoose.model('carts', cartSchema);
