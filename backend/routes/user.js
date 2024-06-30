const express = require('express');
const router = express.Router();
const { register, login } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
