const ProductModel = require('../../models/product.model.js');

class ProductDAO {
    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async createProduct(product) {
        return await ProductModel.create(product);
    }

    async updateProduct(id, update) {
        return await ProductModel.findByIdAndUpdate(id, update, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }

    async getAllProducts() {
        return await ProductModel.find();
    }
}

module.exports = new ProductDAO();
