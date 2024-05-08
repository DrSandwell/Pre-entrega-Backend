const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const socket = require("socket.io");
const PUERTO = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true,   
}))

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Puerto: ${PUERTO}`);
})


const MessageModel = require("./models/message.model.js");
const io = socket(httpServer);

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        await MessageModel.create(data);
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    })
})