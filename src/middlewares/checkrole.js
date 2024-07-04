const jwt = require('jsonwebtoken');
const { JWT_SECRET, COOKIE_TOKEN } = require("../config/config.js");

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies[COOKIE_TOKEN];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.redirect("/access-denied");
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.redirect("/access-denied");
                }
            }
        });
    } else {
        res.redirect("/access-denied");
    }
};

module.exports = checkUserRole;