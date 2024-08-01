const winston = require("winston");

const Product = require("../models/product.model.js");
const CartRepository = require("../repositories/carts.repository.js");
const ProductRepository = require("../repositories/product.repository.js");
const DTO = require("../dto/user.dto.js");

const cartRep = new CartRepository();
const prodRep = new ProductRepository();


class ViewsController {
    async products(req, res) {
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            const { page = 1, limit = 6 } = req.query;
            const skip = (page - 1) * limit;
            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            }
            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                }
            }
            const products = await Product.find(queryOptions).sort(sortOptions).skip(skip).limit(limit);
            const totalProducts = await Product.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const newArray = products.map((producto) => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest };
            });
            const cartId = req.user.cart.toString();
            res.render("products", {
                productos: newArray,
                user: dto,
                isAdmin,
                isUser,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId,
            });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async cart(req, res) {
        const cartId = req.params.cid;
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            const cart = await cartRep.obtenerProductosDeCarrito(cartId);

            if (!cart) {
                winston.info("El carrito no existe");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }
            let totalPurchase = 0;
            const productInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
                totalPurchase += totalPrice;
                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });
            res.render("carts", { productos: productInCart, totalPurchase, cartId, user: dto, isAdmin, isUser });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async login(req, res) {
        try {
            res.render("login");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async register(req, res) {
        try {
            res.render("register");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }



    async realTimeProducts(req, res) {
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            res.render("realtimeproducts", { user: dto, isAdmin, isUser });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async chat(req, res) {
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            res.render("chat", { user: dto, isAdmin, isUser });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async home(req, res) {
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            res.render("home", { user: dto, isAdmin, isUser });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async notFound(req, res) {
        try {
            res.render("404");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async denied(req, res) {
        try {
            res.render("accessDenied");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async ticket(req, res) {
        try {
            res.render("Ticket");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async renderResetPassword(req, res) {
        try {
            res.render("resetPassword");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async renderCambioPassword(req, res) {
        try {
            res.render("passwordCambio");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async renderConfirmacion(req, res) {
        try {
            res.render("confirmacion-envio");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async renderProductDetail(req, res) {
        const prodId = req.params.pid;
        try {
            const dto = new DTO(
                req.user.first_name,
                req.user.last_name,
                req.user.email,
                req.user.role
            );
            const isAdmin = req.user.role === "admin";
            const isUser = req.user.role === "usuario";
            const product = await prodR.getProdById(prodId);
            res.render("productDetail", { product, user: dto, isAdmin, isUser  });
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }

    async renderPasarela(req, res) {
        try {
            res.render("pasarela");
        } catch (error) {
            res.redirect("/404-not-found");
        }
    }
}

module.exports = ViewsController;