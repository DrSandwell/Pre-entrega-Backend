const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();
const ProductModel = require("../models/product.model.js");


router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || "";
        const query = req.query.query || "";

        const queryOptions = {};
        if (query) {
            queryOptions.category = query;
        }

        let sortOptions = {};
        if (sort === "asc") {
            sortOptions = { price: 1 };
        } else if (sort === "desc") {
            sortOptions = { price: -1 };
        }

        const products = await ProductModel.paginate(queryOptions, {
            page: page,
            limit: limit,
            sort: sortOptions,
            lean: true 
        });

        const totalPages = products.totalPages;
        const hasNextPage = products.hasNextPage;
        const hasPrevPage = products.hasPrevPage;

        if (req.accepts("html")) {
            res.render("home", {
                productos: products.docs,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                currentPage: page,
                totalPages: totalPages
            });
        } else {
            const response = {
                status: "success",
                payload: products.docs,
                totalPages: totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
            };
            res.json(response);
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
});

router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const producto = await productManager.getProductById(id);
        if (!producto) {
            return res.json({
                error: "Producto no encontrado"
            });
        }
        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await productManager.addProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;

    try {
        await productManager.updateProduct(id, productoActualizado);
        res.json({
            message: "Producto actualizado correctamente"
        })

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        await productManager.deleteProduct(id);
        res.json({
            message: "Producto eliminado exitosamente"
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

module.exports = router;