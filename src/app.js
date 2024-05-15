const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const PUERTO = 8080;
const MongoStore = require("connect-mongo");
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const userRouter = require("./routes/user.router.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

app.use(session({
    secret:"secretCoder",
    resave: true, 
    saveUninitialized:true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://nikesandwell:coderhouse@cluster0.e8kmgzn.mongodb.net/Comercio?retryWrites=true&w=majority&appName=Cluster0"
    })  
}))

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

app.listen(PUERTO, () => {
    console.log(`Puerto: ${PUERTO}`);
})
