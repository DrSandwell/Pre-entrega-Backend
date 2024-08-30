const ProductRepository = require("../repositories/product.repository.js");
const productRep = new ProductRepository();


class ProductController {
    async addProduct(req, res) {
        const nuevoProducto = req.body;
        try {
            let producto = await productRep.addProduct(nuevoProducto);
            res.status(200).res.json(producto);
        } catch (error) {
            res.status(500).send("Error al crear producto");
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);
            const producto = await productRep.getProducts(limit, page, sort, query);
            res.status(200).json(producto);
        } catch (error) {
            res.status(500).send("Error al obtener productos");
        }
    }
    async getProductsById(req, res) {
        const pid = req.params.pid;
        try {
            const prod = await productRep.getProdById(pid);
            if (!prod) {
                return res.status(404).send("Producto no encontrado"); // Respuesta adecuada si no se encuentra el producto
            }
            res.status(200).json(prod);
        } catch (error) {
            console.error("Error al obtener producto: " + error.message); // Log del error
            res.status(500).send("Error al obtener producto");
        }
    }

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const productUpdate = req.body;
            const producto = await productRep.updateProduct(id, productUpdate);
            res.json(producto);
        } catch (error) {
            res.status(500).send("Error al actualizar el producto");
        }
    }

    async deleteProduct(req, res) {
        const id = req.params.pid;
        try {
            let producto = await productRep.deleteProduct(id);

            res.status(200).json(producto);
        } catch (error) {
            res.status(500).send("Error al eliminar el producto");
        }
    }
}

module.exports = ProductController;