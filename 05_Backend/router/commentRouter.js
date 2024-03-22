const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController')
const { verifyJwt, getUserMiddleware } = require("../dependencies/jwtHelpers");



// Route for pinning a comment - should be defined before other similar routes
router.post('/pincomment/:commentId', verifyJwt, getUserMiddleware, commentController.pinComment);

// Route for adding a comment to a post with postId specified in the URL
router.post('/addcomment/:postId', verifyJwt, getUserMiddleware, commentController.addComment);

 
// Route to upvote a comment
router.put('/upvote/:commentId', verifyJwt, getUserMiddleware, commentController.upvoteCommentAndGetCount);

// Route to downvote a comment
router.put('/downvote/:commentId', verifyJwt,  getUserMiddleware, commentController.downvoteCommentAndGetCount);

module.exports = router;