const express = require("express");
const checkUserRole = require("../middlewares/checkrole.js");
const ProductController = require("../controllers/product.controller.js");

const router = express.Router();
const product = new ProductController(); 

router.get("/", checkUserRole(['usuario']), product.getProducts);
router.post("/", checkUserRole(['admin']), checkUserRole(["premium"]), product.addProduct);
router.get("/:pid", checkUserRole(['usuario']), product.getProductsById);
router.put("/:pid", checkUserRole(['admin']), checkUserRole(["premium"]), product.updateProduct);
router.delete("/:pid", checkUserRole(['admin']), checkUserRole(["premium"]), product.deleteProduct);

module.exports = router;