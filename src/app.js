const express = require("express");
const app= express();
const PUERTO = 8080;
const productRouter = require("./routes/products.router");
const cartsRouter= require("./routes/carts.router");


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("si funciona");
})

app.use("/api", productRouter);
app.use("/api", cartsRouter);


app.listen(PUERTO,()=>{
    console.log(`Escuchando en el puerto : ${PUERTO}`);
})