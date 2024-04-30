const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const productSchema = new mongoose.Schema({
    titulo: {
        type: String, 
        index: true,
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

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("productos", productSchema);

module.exports = ProductModel; 