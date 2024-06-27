const nodemailer = require("nodemailer");
const { GMAIL_PASSWORD, MAIL_USER } = require("../config/config.js")

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
                    <p>Gracias por tu compra!</p>
                    <p>orden de compra #:${ticket}</p>
                `,
            };
            await this.transporter.sendMail(Opt);
        } catch (error) {
            console.error("Error al enviar Email:");
        }
    }
}

module.exports = EmailManager;