const ProductModel = require("../models/product.model.js");

class ProductRepository {
    async crearProducto(datoProducto) {
        try {
            const producto = new ProductModel(datoProducto);
            return await producto.save();
        } catch (error) {
            throw new Error("Error al crear producto");
        }
    }

    async obtenerProducto() {
        try {
            return await ProductModel.find();
        } catch (error) {
            throw new Error("Error al obtener los productos");
        }
    }


}



/* const { productDAO } = require('../daos/mongo');

class ProductRepository {
    async getProductById(id) {
        return await productDAO.getProductById(id);
    }

    async createProduct(product) {
        return await productDAO.createProduct(product);
    }

    async updateProduct(id, update) {
        return await productDAO.updateProduct(id, update);
    }

    async deleteProduct(id) {
        return await productDAO.deleteProduct(id);
    }

    async getAllProducts() {
        return await productDAO.getAllProducts();
    }
        } 
    
module.exports = new ProductRepository();*/

module.exports = ProductRepository;