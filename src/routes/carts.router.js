const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager();
const authMiddleware = require('../middlewares/auth.middleware.js');

router.use(authMiddleware);

router.post("/", cartManager.crearCarrito);
router.get("/:cid", cartManager.getCarritoById);
router.post("/:cid/product/:pid", cartManager.agregarProductoAlCarrito);
router.delete('/:cid/product/:pid', cartManager.eliminarProductoDelCarrito);
router.put('/:cid', cartManager.actualizarCantidadDeProducto);
router.put('/:cid/product/:pid', cartManager.actualizarCantidadDeProducto);
router.delete('/:cid', cartManager.vaciarCarrito);
router.post('/:cid/purchase', cartManager.finalizarCompra);

module.exports = router;