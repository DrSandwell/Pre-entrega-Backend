const { productDAO } = require('../daos/mongo');

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

module.exports = new ProductRepository();
