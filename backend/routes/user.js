const express = require('express');
const router = express.Router();
const { register, login,logout,updatePassword } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/update/password").put(isAuthenticated, updatePassword);

module.exports = router;
