const express = require('express');
const { createPost,deletePost ,likeAndUnlikePost,commentOnPost,getPostOfFollowing,updateCaption} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").delete(isAuthenticated, deletePost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost);
router.route("/post/comment/:id").post(isAuthenticated, commentOnPost);
router.route("/posts").get(isAuthenticated, getPostOfFollowing);
router.route("/post/:id").put(isAuthenticated, updateCaption);

module.exports = router;
