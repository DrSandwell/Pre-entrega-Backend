const CartModel = require("../models/cart.model.js");

class CartManager {

    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un carrito nuevo", error);
            throw error; 
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate('products.product');

            if(!carrito) {
                console.log("No existe un carrito con ese ID");
                return null; 
            }
            
            return carrito;

        } catch (error) {
            console.log("Error al cargar carrito por ID", error);
            throw error; 
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if(existeProducto) {
                existeProducto.quantity += quantity; 
            }else {
                carrito.products.push({product: productId, quantity});
            }           
            carrito.markModified("products");

            await carrito.save();
            return carrito;
            
        } catch (error) {
            console.log("Error al agregar un producto", error);
            throw error; 
        }
    }
    async actualizarCarrito(cartId, productos) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = productos;
            await carrito.save();
        } catch (error) {
            console.log("Error al actualizar el carrito", error);
            throw error;
        }
    }
    async actualizarCantidadProducto(cartId, productId, quantity) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const producto = carrito.products.find(item => item.product.toString() === productId);
            if (producto) {
                producto.quantity = quantity;
                carrito.markModified("products");
                await carrito.save();
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.log("Error al actualizar la cantidad del producto en el carrito", error);
            throw error;
        }
    }
    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = carrito.products.filter(item => item.product.toString() !== productId);
            await carrito.save();
        } catch (error) {
            console.log("Error al eliminar producto del carrito", error);
            throw error;
        }
    }
    async vaciarCarrito(cartId) {
        try {
            const carrito = await this.getCarritoById(cartId);
            carrito.products = [];
            await carrito.save();
        } catch (error) {
            console.log("Error al vaciar el carrito", error);
            throw error;
        }
    }
}

module.exports = CartManager;