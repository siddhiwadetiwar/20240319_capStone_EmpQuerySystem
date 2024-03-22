const express = require('express');
const router = express.Router();
const { pinComment } = require('../controllers/postController');
const postController = require('../controllers/postController');
const { verifyJwt, getUserMiddleware } = require("../dependencies/jwtHelpers");

// Route for pinning a comment - should be defined before other similar routes
router.post('/pincomment/:postId/:commentId', verifyJwt, getUserMiddleware, pinComment);

// Route for adding a post
router.post('/addpost', verifyJwt, getUserMiddleware, postController.addPost);

// Route for adding a comment to a post with postId specified in the URL
router.post('/addcomment/:postId', verifyJwt, getUserMiddleware, postController.addComment);

// Route for adding a comment without postId in the URL (if needed)
router.post('/addcomment', verifyJwt, getUserMiddleware, postController.addComment);

// Route for getting all posts
router.get('/getallpost', postController.getAllPosts);

// Route for searching for a user
router.get('/searchuser', postController.getAllPostsByUsername);

// Route for filtering posts
router.get('/filter', postController.getFilteredPosts);

// Route for upvoting a post
router.post('/upvote/:postId', verifyJwt, getUserMiddleware, postController.upvotePostAndGetCount);

// Route for downvoting a post
router.post('/downvote/:postId', verifyJwt, getUserMiddleware, postController.downvotePostAndGetCount);

module.exports = router;
