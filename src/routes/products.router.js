const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();



router.get("/", productManager.getProducts);
router.get("/:id", productManager.getProductById);
router.post("/", productManager.addProduct);
router.put("/:id", productManager.updateProduct);
router.delete("/", productManager.deleteProduct);



module.exports = router;