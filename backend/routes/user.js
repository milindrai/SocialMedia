const express = require('express');
const router = express.Router();
const { register, login,logout } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);

module.exports = router;
