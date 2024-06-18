const { cartDAO } = require('../daos/mongo');

class CartRepository {
    async getCartById(id) {
        return await cartDAO.getCartById(id);
    }
    async updateCart(id, update) {
        return await cartDAO.updateCart(id, update);
    }
}

module.exports = new CartRepository();
