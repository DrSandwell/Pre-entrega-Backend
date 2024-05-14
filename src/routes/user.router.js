const express = require("express");
const router = express.Router();
const passport = require("passport");

/* router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: "El correo electrónico ya está registrado" });
        }
        const role = email === 'admincoder@coder.com' ? 'admin' : 'usuario';

        const newUser = await UserModel.create({ first_name, last_name, email, password: createHash(password), age, role });

        req.session.login = true;
        req.session.user = { ...newUser._doc };

        res.redirect("/products");

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
}); */

router.post("/", passport.authenticate("register",{
    failureRedirect: "/failedregister"
}), async (req,res)=>{
    if(!req.user){
        return res.status(400).send("Credenciales invalidas");
    }
    req.session.user= {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };
    req.session.login= true;
    res.redirect("/profile");
})

router.get("/failedregister", (req,res)=>{
    res.send("Registro fallido");
})

module.exports = router;