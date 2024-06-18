const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const dotenv = require("dotenv");
const config = require("./config/config.js");
const passport = require("passport");
const { SESSION_SECRET, MONGODB_URI } = require('./config/config');
const mongoose = require('mongoose');
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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        ttl: 14 * 24 * 60 * 60 // 14 days
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

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conexión exitosa a la base de datos'))
    .catch((error) => console.error('Error en la conexión a la base de datos', error));

app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${config.PORT}`);
});