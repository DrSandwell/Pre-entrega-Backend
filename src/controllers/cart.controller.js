const Ticket = require("../models/ticket.model.js");
const User = require("../models/user.model.js");
const CartRepository = require("../repositories/carts.repository.js");
const totalCompra = require("../utils/util.js");

const cartRep = new CartRepository();

class CartController {

    async crearCarrito(req, res) {
        try {
            const nuevoCarrito = await cartRep.createCart();
            res.json(nuevoCarrito);
        } catch (error) {
            res.status(500).send("Error al crear carrito");
        }
    }

    async getCarritoById(req, res) {
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

    async agregarProductoAlCarrito(req, res) {
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

    async actualizarCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        try {
            const updatedCart = await cartRep.UpdateQuantity(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).send("Error al actualizar productos en el carrito");
        }
    }

    async actualizarCantidadDeProducto(req, res) {
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

    async eliminarProductoDelCarrito(req, res) {
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
    
    async vaciarCarrito(req, res) {
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

    async finalizarCompra(req,res){
        const cartId= req.params.cid;
        try {
            const cart = await cartRep.obtenerProductosDeCarrito(cartId);
            const userWithCart = await User.findOne({ cart: cartId });
            const ticket = new Ticket({
                amount: totalCompra(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();
            await cart.save();
            res.redirect(`/${cartId}/purchase`)
        } catch (error) {
            console.error('Error al realizar compra, intenta nuevamente');
            res.status(500).json({ error: 'Error al comprar productos' });
        }
    }
}

module.exports = CartController;