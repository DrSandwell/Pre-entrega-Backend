const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require ( "../controllers/user-controller.js");

const userController= new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", passport.authenticate("jwt",{session: false}), userController.profile)
router.post("/logout",userController.logout.bind(userController));
router.get("/admin",passport.authenticate("jwt",{session:false}),userController.admin);

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/admin/:uid",userController.cambiarRolPremium);


/* router.post("/", passport.authenticate("register",{
    failureRedirect: "/failedregister"
}), async (req,res)=>{
    if(!req.user){
        return res.status(400).send("Credenciales invalidas");
    }
    req.session.user= {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };
    req.session.login= true;
    res.redirect("/profile");
})

router.get("/failedregister", (req,res)=>{
    res.send("Registro fallido");
})
 */
module.exports = router;