const express = require("express");
const checkUserRole = require("../middlewares/checkrole.js");
const ProductController = require("../controllers/product.controller.js");

const router = express.Router();
const product = new ProductController(); 

router.get("/", checkUserRole(["usuario", "premium"]), product.getProducts);
router.post("/", checkUserRole(["admin", "premium"]), product.addProduct);
router.get("/:pid", checkUserRole(["usuario", "premium"]), product.getProductById);
router.delete("/:pid", checkUserRole(["admin", "premium"]), product.deleteProduct);
router.put("/:pid", checkUserRole(["admin", "premium"]), product.updateProduct);
module.exports = router;