const ProductRepository = require("../repositories/product.repository.js");
const Product = require("../models/product.model.js");
const productRep = new ProductRepository();


class ProductController {
    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            let producto = await productRep.addProduct(nuevoProducto);
            res.json(producto);
        } catch (error) {
            res.status(500).send("Error al crear producto");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const producto = await productRep.getProducts(limit, page, sort, query);
            res.json(producto);
        } catch (error) {
            res.status(500).send("Error al obtener productos");
        }
    }

    async updateProduct(req,res) {
        try {
            const id = req.params.pid;
            const productUpdate = req.body;
            const producto = await productRep.updateProduct(id, productUpdate);
            res.json(producto);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req,res) {
        const id = req.params.pid;
        try {
            let producto = await productRep.deleteProduct(id);

            res.json(producto);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = ProductController;