const express = require("express");
const checkUserRole = require("../middlewares/checkrole.js");
const ProductController = require("../controllers/product.controller.js");
const passport = require("passport");

const router = express.Router();
const product = new ProductController(); 

router.get("/", product.getProducts);
router.post("/",  passport.authenticate("jwt", { session: false }), product.addProduct);
router.get("/:pid", product.getProductsById);
router.put("/:pid", /* checkUserRole(['admin']), checkUserRole(["premium"]), */ product.updateProduct);
router.delete("/:pid", /* checkUserRole(['admin']), checkUserRole(["premium"]), */ product.deleteProduct);

module.exports = router;