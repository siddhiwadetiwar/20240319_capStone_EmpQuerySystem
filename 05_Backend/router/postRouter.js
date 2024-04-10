const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');
const { verifyJwt, getUserMiddleware } = require("../dependencies/jwtHelpers");



// Route for adding a post
router.post('/addpost', verifyJwt, getUserMiddleware, postController.addPost);

// Route for getting all posts
router.get('/getallpost', postController.getAllPosts);

// Route for searching for a user
router.get('/searchuser/:username', postController.getAllPostsByUsername);

// Route for filtering posts
router.get('/filter', postController.getFilteredPosts);

//Delete Posts
router.delete('/deletePosts/:postId',verifyJwt, getUserMiddleware, postController.deletePostsById);

// Route for upvoting a post
router.post('/upvote/:postId', verifyJwt, getUserMiddleware, postController.upvotePostAndGetCount);

// Route for downvoting a post
router.post('/downvote/:postId', verifyJwt, getUserMiddleware, postController.downvotePostAndGetCount);



module.exports = router;
