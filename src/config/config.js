const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 8080,
    SECRET_KEY: process.env.SECRET_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET || 'default_session_secret'
};