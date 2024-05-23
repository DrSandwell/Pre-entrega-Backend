const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require ("passport-github2");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

const LocalStrategy= local.Strategy;

const initializePassport = ()=>{
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done)=>{
        const {first_name, last_name, email, age, role}=req.body;
        try{
            let usuario = await UserModel.findOne({email});
            if(usuario) {
                return done(null,false);
            }
            let nuevoUsuario ={
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role
            }
            let resultado= await UserModel.create(nuevoUsuario);
            return done(null,resultado);

        } catch(error){
            return done(error);
        }
    }))
    passport.use("login", new LocalStrategy({
        usernameField:"email"
    }, async(email, password,done)=>{
        try{
            let usuario = await UserModel.findOne({email});
            if(!usuario){
                console.log("Este usuario no existe");
                return done(null, false);
            }
            if(!isValidPassword(password,usuario)){
                return done(null, false)
            }
            return done(null,usuario);

        }catch(error){
            return done(error);
        }        
    }))
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        let user= await UserModel.findById({_id:id});
        done(null, user)
    })

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liG5LZb2DW0eFunx",
        clienteSecret: "756d84ffa1a2f1203720b73541acb777183bcc88",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refeshToken, profile, done)=>{
        console.log("Profile:", profile);

        try{
            let usuario = await UserModel.findOne({email: profile._json.email})

            if(!usuario){
                let nuevoUsuario={
                    first_name: profile._json.name,
                    last_name: "",
                    age: 36,
                    email: profile._json.email,
                    password: "",
                    role: "usuario"
                }
                let resultado = await UserModel.create(nuevoUsuario);
                done(null,resultado);
            }else{
                done(null,usuario);
            }
        }catch(error){
            return done(error);
        }
    }))
}

module.exports = initializePassport