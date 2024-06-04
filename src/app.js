const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const dotenv = require("dotenv");
const config = require("./config/config.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const MongoStore = require("connect-mongo");

require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");

dotenv.config(); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

app.use("*", (req, res) => {
    res.status(404).send("Recurso no encontrado");
});

app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${config.PORT}`);
});