const express = require("express");
const passport = require("passport");
const checkUserRole = require("../middlewares/checkrole.js");

const UserController = require("../controllers/user.controller.js");

const router = express.Router();
const user = new UserController();


router.post("/register", user.register);
router.post("/login", user.login);
router.get("/profile", passport.authenticate("jwt", { session: false }), user.profile);
router.post("/logout", user.logout.bind(user));
router.get("/admin", passport.authenticate("jwt", { session: false }), user.admin);
router.post("/requestPasswordReset", user.requestPasswordReset);
router.post("/reset-password", user.resetPassword);
router.put("/premium/:uid", checkUserRole(["admin"]), user.cambiarRolPremium);
router.get("/", checkUserRole(["admin"]), user.getUsers);
router.get("/:uid", checkUserRole(["admin"]), user.getUserById);
router.put("/:uid", checkUserRole(["admin"]), user.updateUser);
router.delete("/:uid", checkUserRole(["admin"]), user.deleteUser);

module.exports = router;