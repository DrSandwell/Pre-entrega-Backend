const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();
const CartModel = require("../models/cart.model.js");
const { isUser } = require('../middlewares/auth.middleware.js');
const CartsRepository = require('../repositories/carts.repository.js');
const TicketsRepository = require('../repositories/tickets.repository');
const { v4: uuidv4 } = require('uuid');

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        console.error("Error al crear carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await CartModel.findById(cartId)

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {
        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartManager.vaciarCarrito(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

router.post('/:cid/purchase', isUser, async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartsRepository.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let amount = 0;
        const unavailableProducts = [];
        const updatedProducts = cart.products.map(item => {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                amount += product.price * item.quantity;
                return { ...item.toObject(), product };
            } else {
                unavailableProducts.push(product._id);
                return item;
            }
        });

        cart.products = updatedProducts.filter(item => !unavailableProducts.includes(item.product._id));
        await CartsRepository.updateCart(cid, cart);

        if (amount > 0) {
            const ticket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount,
                purchaser: req.user.email
            };
            await TicketsRepository.createTicket(ticket);
            res.status(200).json({ ticket, unavailableProducts });
        } else {
            res.status(200).json({ message: 'No products available for purchase', unavailableProducts });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;