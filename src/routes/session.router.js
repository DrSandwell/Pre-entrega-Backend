const express = require("express");
const router = express.Router();
const UserDTO = require('../dtos/user.dto');
const passport = require("passport");


router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async(req,res)=>{
    if(!req.user){
        return res.status(400).send("Credenciales invalidad");
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

router.get("/faillogin", async(req, res)=>{
    res.send("Fallo en el login");
})
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

router.get("/github", passport.authenticate("github",{scope: ["user:email"]}),async(req,res)=>{})

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}, async(req,res)=>{
    req.session.user= req.user;
    req.session.login=true;
    res.redirect("/profile");
}))

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UserDTO(req.user);
        res.json(userDTO);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router; 