const mongoose = require("mongoose");
const { MONGODB_URI } = require("./config/config.js");

mongoose.connect(MONGODB_URI).then(() => console.log("Conexión exitosa a la base de datos"))
    .catch((error) => console.error("Error en la conexión a la base de datos", error));