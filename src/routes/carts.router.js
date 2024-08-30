const express = require("express");
const checkUserRole = require("../middlewares/checkrole.js");
const CartController = require("../controllers/cart.controller.js");

const router = express.Router();
const cart = new CartController();

router.post("/", cart.createCart);
router.get("/:cid", checkUserRole(["usuario", "premium"]), cart.getProductsToCart);
router.post("/:cid/product/:pid", checkUserRole(["usuario", "premium"]), cart.addProductsToCart);
router.delete('/:cid/product/:pid', checkUserRole(["usuario", "premium"]), cart.deleteProductToCart);
router.put('/:cid', checkUserRole(["usuario", "premium"]), cart.updateProductsToCart);
router.put('/:cid/product/:pid', checkUserRole(["usuario", "premium"]), cart.updateQuantity);
router.delete('/:cid', checkUserRole(["usuario", "premium"]), cart.emptyCart);
router.post('/:cid/purchase', checkUserRole(["usuario", "premium"]), cart.finishPurchase);

module.exports = router;