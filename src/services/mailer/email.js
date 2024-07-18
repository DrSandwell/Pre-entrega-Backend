const nodemailer = require("nodemailer");
const { GMAIL_PASSWORD, MAIL_USER } = require("../../config/config.js")
const winston = require("winston");


class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: MAIL_USER ,
                pass: GMAIL_PASSWORD,
            },
        });
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const Opt = {
                from: MAIL_USER ,
                to: email,
                subject: "compra exitosa",
                html: `
                    <p>Gracias por tu compra ${first_name} !</p>
                    <p>orden de compra #:${ticket}</p>
                `,
            };
            await this.transporter.sendMail(Opt);
        } catch (error) {
            winston.error("Error al enviar Email:");
        }
    }

    async enviarCorreoRestableciminto(email, first_name, token) {
        try {
            const Opt = {
                from: MAIL_USER,
                to: email,
                subject: "Restablecimiento de contraseña",
                html: `
                    <p>Restablecimeinto de contraseña </p>
                    <p>Olvidaste tu contraseña ${first_name}? </p>
                    <p>Codigo de confirmacion: </p>
                    <strong> ${token} </strong>
                    <p>Este codigo expirara en una hora</p>
                    <a href="http://localhost:8080/password">Restablecer contraseña</a>
                `,
            };
            await this.transporter.sendMail(Opt);
        } catch (error) {
            winston.error("Error al enviar el correo de restablecimiento");
        }
    };
}

module.exports = EmailManager;