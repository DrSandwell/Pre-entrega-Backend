const express = require("express");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require('path');
const passport = require("passport");
const winston = require("winston");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

require("./database.js");
const initializePassport = require("./config/passport.config.js");
const { PORT } = require('./config/config.js');

const auth = require("./middlewares/auth.middleware.js");
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(passport.initialize());
app.use(auth);
app.use(addLogger)

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

initializePassport();

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Ecommerce",
            description:
                "Ecommerce dedicada a la venta de productos relacionados con el manga y anime japones",
        },
    },
    apis: ["./src/docs/**/*.yaml"],
};
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
    winston.info(`Server connected http://localhost:${PUERTO}`);
});

new SocketManager(httpServer);