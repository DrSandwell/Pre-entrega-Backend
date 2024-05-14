const passport = require("passport");
const { initialize } = require("passport");
const local = require("passport-local");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

const LocalStrategy= local.Strategy;

const initializePassport = ()=>{
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done)=>{
        const {first_name, last_name, email, age}=req.body;
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
                password: createHash(password)
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
}

module.exports = initializePassport

