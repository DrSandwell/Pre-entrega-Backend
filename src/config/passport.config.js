const passport = require("passport");
const jwt = require("passport-jwt");
const GitHubStrategy = require ("passport-github2");

const UserModel = require("../models/user.model.js");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET, COOKIE_TOKEN } = require("../config/config.js");

const JWTStrategy = jwt.Strategy;
const Jwt = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: Jwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clienteSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refeshToken, profile, done) => {
        console.log("Profile:", profile);

        try {
            let usuario = await UserModel.findOne({ email: profile._json.email })

            if (!usuario) {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 36,
                    email: profile._json.email,
                    password: "",
                    role: "usuario"
                }
                let resultado = await UserModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))  
}
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[COOKIE_TOKEN]
    }
    return token;
}

module.exports = initializePassport