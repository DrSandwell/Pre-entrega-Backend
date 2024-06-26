const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number
});

const ProductModel = mongoose.model('productos', productSchema);
module.exports = ProductModel