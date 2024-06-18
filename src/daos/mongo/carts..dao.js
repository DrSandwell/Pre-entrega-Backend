const CartModel = require('../../models/cart.model.js');

class CartDAO {
    async getCartById(id) {
        return await CartModel.findById(id).populate('products.product').exec();
    }

    async updateCart(id, cart) {
        return await CartModel.findByIdAndUpdate(id, cart, { new: true });
    }
}

module.exports = new CartDAO();
