const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    titulo: {
        type: String, 
        required: true
    },
    descripcion: {
        type: String, 
        required: true
    },
    precio: {
        type: Number, 
        required: true
    },
    img: {
        type: String
    }, 
    code: {
        type:String, 
        unique: true, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    status: {
        type: Boolean, 
        required: true
    },
    thumbnails: {
        type: [String]
    }
});

const ProductModel = mongoose.model("productos", productSchema);

module.exports = ProductModel; 