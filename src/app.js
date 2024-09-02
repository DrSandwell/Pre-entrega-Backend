const express = require("express");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const path = require('path');
const passport = require("passport");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const { swaggerOptions } = require("./middlewares/swagger.middleware.js");
const { logger } = require("./middlewares/loggerMiddleware.js");

require("./database.js");
const initializePassport = require("./config/passport.config.js");
const { PORT } = require('./config/config.js');

const auth = require("./middlewares/auth.middleware.js");
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(passport.initialize());
app.use(auth);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

initializePassport();

const specs = swaggerJSDoc(swaggerOptions);


app.use("/api/logger-test", loggerRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", testRouter);
app.use("/", viewsRouter);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use(ErrorManager);


const httpServer = app.listen(PUERTO, () => {
    logger.info(`Server connected http://localhost:${PUERTO}`);
});

new SocketManager(httpServer);