const express = require('express');
const { createPost,deletePost ,likeAndUnlikePost,commentOnPost} = require('../controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route("/post/upload").post(isAuthenticated, createPost);
router.route("/post/:id").delete(isAuthenticated, deletePost);
router.route("/post/:id").get(isAuthenticated, likeAndUnlikePost);
router.route("/post/comment/:id").put(isAuthenticated, commentOnPost);

module.exports = router;
