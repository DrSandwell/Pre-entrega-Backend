const socket = require("socket.io");
const { logger } = require("../middlewares/loggerMiddleware.js");

const ProductRepository = require("../repositories/product.repository.js");
const MessageController = require("../controllers/message.controller.js");

const product = new ProductRepository();
const Message = new MessageController()

class SocketManager {
    constructor(httpServer) {
        this.io = socket(httpServer);
        this.initSocketEvents();
    }
    async initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("Usuario conectado");
            socket.emit("products", await product.getProducts());
            socket.on("deleteProd", async (id) => {
                await product.deleteProduct(id);
                this.emitUpdatedProducts(socket);
            });
            socket.on("addProd", async (producto) => {
                await product.addProduct(producto);
                this.emitUpdatedProducts(socket);
            });
            socket.on("message", async (data) => {
                await Message.createMessage(data);
                this.io.emit("chat", await Message.getMessages());
            });
            socket.on("clearchat", async () => {
                await Message.deleteAllMessages();
            });
        });
    }
    async emitUpdatedProducts(socket) {
        socket.emit("products", await product.getProducts());
    }
}

module.exports = SocketManager;