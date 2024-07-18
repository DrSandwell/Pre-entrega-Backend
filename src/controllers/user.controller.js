const jwt = require("jsonwebtoken");
const winston = require("winston");

const User = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");

const { JWT_SECRET, COOKIE_TOKEN } = require("../config/config.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const DTO  = require("../dto/user.dto.js");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await User.findOne({ email });
            if (existeUsuario) {
                return res.status(400).send("El usuario ya existe");
            }

            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();
            const nuevoUsuario = new User({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id,
                password: createHash(password),
                age
            });
            await nuevoUsuario.save();
            const token = jwt.sign({ user: nuevoUsuario }, JWT_SECRET, {
                expiresIn: "1h"
            });
            res.cookie(COOKIE_TOKEN, token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/api/users/profile");
        } catch (error) {
            winston.error(error);
            res.status(500).send("Error al registrar usuario");
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const userFound = await User.findOne({ email });

            if (!userFound) {
                return res.status(401).send("Credenciales incorrectas");
            }
            const isValid = isValidPassword(password, userFound);
            if (!isValid) {
                return res.status(401).send("Contraseña incorrecta");
            }
            const token = jwt.sign({ user: userFound }, JWT_SECRET, {
                expiresIn: "1h"
            });
            res.cookie(COOKIE_TOKEN, token, {
                maxAge: 3600000,
                httpOnly: true
            });
            res.redirect("/home");
        } catch (error) {
            winston.error(error);
            res.status(500).send("Error al iniciar sesion");
        }
    }
    async profile(req, res) {
        const dto = new DTO(req.user.first_name, req.user.last_name, req.user.email, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: dto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie(COOKIE_TOKEN);
        res.redirect("/");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.redirect("/access-denied")
        }
        res.render("admin");
    }
    
    async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if(!user) {
                return res.status(404).send("Usuario no encontrado");
            }
            const token = generarResetToken();
            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }
            await user.save();
            await emailManager.enviarCorreoRestableciminto(email, user.first_name, token);
            res.redirect("/confirmacion-envio");
        }catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword (req, res) {
        const { email, password, token } = req.body;
        try{
            const user = await User.findOne({ email });
            if(!user) {
                return res.render("passwordCambio", { error: "Usuario no encontrado" })
            }
            const resetToken = user.resetToken;
            if(!resetToken || resetToken.token !== token) {
                return res.render("resetpassword", {error : "Token invalido, intenta nuevamente"});
            }
            const now = new Date();
            if(now > resetToken.expire){
                return res.render("resetpassword", {error: "el token ha expirado"});
            }
            if(isValidPassword(password, user)) {
                return res.render("passwordCambio", { error: "La nueva contraseña no puede ser igual a la anterior"});
            }
            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();
            return res.redirect("/");
        } catch(error) {
            res.status(500).render("resetpassword", { error: "Error interno del servidor"});
        }
    }
    
    async cambiarRolPremium(req, res) {
        const { uid } = req.params;
        try {
            const user = await User.findById(uid);
            if(!user) {
                return res.status(404).send("usuario no encontrado");
            }
            const nuevoRol = user.role === "usuario" ? "premium" : "usuario";
            const actualizado = await User.findByIdAndUpdate(uid, { role: nuevoRol });
            res.json(actualizado);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
}


module.exports = UserController;
