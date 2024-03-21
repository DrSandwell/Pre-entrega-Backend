const fs = require('fs').promises;

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({ titulo, descripcion, precio, img, code, stock }) {
        try {
            const arrayProductos = await this.leerArchivo()

            if (!titulo || !descripcion || !precio || !img || !code || !stock) {
                console.log("Completar todos los campos");
                return;
            }

            if (arrayProductos.some(item => item.code === code)) {
                console.log("Error al intentar agregar el producto. El código debe ser único");
                return;
            }

            const nuevoProducto = {
                titulo,
                descripcion,
                precio,
                img,
                code,
                stock,
                status: true,
            };

            if (arrayProductos.length > 0) {
                ProductManager.ult = arrayProductos.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            nuevoProducto.id = ++ProductManager.ultId;

            arrayProductos.push(nuevoProducto);

            await this.guardarArchivo(this.products);
        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo();
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);
            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Siii lo encontramos!");
                return buscado;
            }
        } catch (error) {
            console.log("Error al leer el archivo", error);
            throw error;
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer un archivo", error);
            throw error;
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
            throw error;
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);
            if (index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("No se encontro el producto")
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }
    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto eliminado");
            } else {
                console.log("No se encontró el producto");
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

module.exports = ProductManager;