const mongoose = require("mongoose");


mongoose.connect("mongodb+srv://nikesandwell:coderhouse@cluster0.e8kmgzn.mongodb.net/Comercio?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))


