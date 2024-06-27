const express = require("express");
const checkUserRole = require("../middlewares/checkrole.js");
const CartController = require("../controllers/cart.controller.js");

const router = express.Router();
const cart = new CartController();

router.post("/", cart.crearCarrito.bind(cart)); // Asegúrate de enlazar el contexto
router.get("/:cid", checkUserRole(['usuario']), cart.getCarritoById.bind(cart));
router.post("/:cid/product/:pid", checkUserRole(['usuario']), cart.agregarProductoAlCarrito.bind(cart));
router.delete('/:cid/product/:pid', checkUserRole(['usuario']), cart.eliminarProductoDelCarrito.bind(cart));
router.put('/:cid', checkUserRole(['usuario']), cart.actualizarCarrito.bind(cart));
router.put('/:cid/product/:pid', checkUserRole(['usuario']), cart.actualizarCantidadDeProducto.bind(cart));
router.delete('/:cid', checkUserRole(['usuario']), cart.vaciarCarrito.bind(cart));
router.post('/:cid/purchase', checkUserRole(['usuario']), cart.finalizarCompra.bind(cart));

module.exports = router;
