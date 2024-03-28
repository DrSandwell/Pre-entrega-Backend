const express = require("express");
const app= express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const productRouter = require("./routes/products.router");
const cartsRouter= require("./routes/carts.router");
const viewsRouter = require("./routes/views.router.js");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));



app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api", productRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Puerto: ${PUERTO}`);
})

const io = socket(httpServer);

const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    socket.emit("productos", await productManager.getProducts());

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("productos", await productManager.getProducts());
    })

    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        socket.emit("productos", await productManager.getProducts());
    })
})