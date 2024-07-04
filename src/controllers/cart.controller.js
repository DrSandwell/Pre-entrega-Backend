const Ticket = require("../models/ticket.model.js");
const User = require("../models/user.model.js");
const winston = require("winston");

const CartRepository = require("../repositories/carts.repository.js");
const {totalCompra, ticketNumberRandom} = require("../utils/util.js");

const cartRep = new CartRepository();

class CartController {

    async createCart(req, res) {
        try {
            const nuevoCarrito = await cartRep.createCart();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error al crear carrito");
        }
    }

    async getProductsToCart(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRep.obtenerProductosDeCarrito(cartId);
            if (!products) {
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).send("Error al obtener productos del carrito");
        }
    }

    async addProductsToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRep.addProductInCart(cartId, productId, quantity);
            const ID = (req.user.cart).toString();

            res.redirect(`/carts/${ID}`)
        } catch (error) {
            res.status(500).send("Error al agregar productos al carrito");
        }    
    }

    async updateProductsToCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartRep.UpdateQuantity(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error al actualizar productos en el carrito");
        }
    }

    async updateQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRep.UpdateQuantity(cartId, productId, newQuantity);
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizado en el carrito',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al actualizar el stock del carrito");
        }

    }

    async deleteProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRep.deleteProductInCart(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al eliminar producto del carrito");
        }
    }
    
    async emptyCart(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRep.emptyCart(cartId);
            res.json({
                status: 'success',
                message: 'Carrito vacio',
                updatedCart,
            });
        } catch (error) {
            res.status(500).send("Error al vaciar carrito");
        }
    }

    async finishPurchase(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRep.obtenerProductosDeCarrito(cartId);            
            const userWithCart = await User.findOne({ cart: cartId }); 
            const ticket = new Ticket({
                code: ticketNumberRandom(),
                amount: totalAmount(cart.products),
                purchaser: userWithCart._id
            });    
            await ticket.save();
            await cart.save();    
            res.redirect(`/${cartId}/purchase`);
            console.error('Redirecting to purchase page');
        } catch (error) {
            winston.error('Error al realizar compra, intenta nuevamente');
            res.status(500).json({ error: 'Error al comprar productos' });
        }
    }
}

module.exports = CartController;