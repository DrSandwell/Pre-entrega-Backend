const express = require("express");
const { engine }= require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const winston = require("winston");
const path = require('path');

require("./database.js");
const initializePassport = require("./config/passport.config.js");
const {PORT} = require('./config/config.js');

const auth = require("./middlewares/auth.middleware.js");
const brotliCompression = require("./middlewares/brotlyCompression.js");
const addLogger = require("./middlewares/loggerMiddleware.js");
const ErrorManager = require("./middlewares/errorsMiddleware.js");


const SocketManager = require("./sockets/socketmanager.js");


const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const testRouter = require("./routes/test.router.js");
const loggerRouter = require("./routes/logger.router.js");


const app = express();
const PUERTO = PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());
app.use(auth);
app.use(addLogger)
brotliCompression();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/logger-test", loggerRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", testRouter);
app.use("/", viewsRouter);
app.use(ErrorManager);


const httpServer = app.listen(PUERTO, () => {
    winston.info(`Server connected http://localhost:${PUERTO}`);
});

new SocketManager(httpServer);