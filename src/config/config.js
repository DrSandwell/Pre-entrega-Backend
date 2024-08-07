const dotenv = require("dotenv");
const program  = require("./commander.config")

const { mode } = program.opts();

dotenv.config({
    path: mode === "dev" ? "./.env.dev" : "./.env.build",
});

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 8080,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    MAIL_USER: process.env.MAIL_USER,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_TOKEN: process.env.COOKIE_TOKEN,
    SECRET_KEY: process.env.SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET || 'default_session_secret'
};