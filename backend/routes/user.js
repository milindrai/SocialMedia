const express = require('express');
const router = express.Router();
const { register, login,logout,updatePassword,followUser,unfollowUser,getFollowers,getFollowing,updateProfile } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);
router.route("/update/password").put(isAuthenticated, updatePassword);
router.route("/follow/:id").get(isAuthenticated, followUser);
router.route("/unfollow/:id").get(isAuthenticated, unfollowUser);
router.route("/followers/:id").get(isAuthenticated, getFollowers);
router.route("/following/:id").get(isAuthenticated, getFollowing);
router.route("/update/profile").put(isAuthenticated, updateProfile);

module.exports = router;
