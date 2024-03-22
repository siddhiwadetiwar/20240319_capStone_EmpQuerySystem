const express = require('express');
const router = express.Router();
// const { pinCommentValidator } = require('../validators/pinCommentValidator');
const { pinComment } = require('../controllers/postController');
const postController = require('../controllers/postController')
const { verifyJwt, getUserMiddleware } = require("../dependencies/jwtHelpers");
//const {getAllPostsByUsername} = require('../controllers/postController')


// Route for pinning a comment
router.post('/pincomment/:postId/:commentId', pinComment);
router.post('/addpost', verifyJwt, getUserMiddleware, postController.addPost);
// Route for adding a comment to a post
router.post('/addcomment/:postId', verifyJwt, getUserMiddleware, postController.addComment);
router.post('/addcomment', verifyJwt, getUserMiddleware, postController.addComment);
router.get('/getallpost', postController.getAllPosts);
router.get('/searchuser', postController.getAllPostsByUsername);
router.get('/filter',postController.getFilteredPosts);
router.post('/upvote/:postId',verifyJwt, getUserMiddleware, postController.upvotePostAndGetCount);
router.post('/downvote/:postId',verifyJwt, getUserMiddleware, postController.downvotePostAndGetCount);

module.exports = router;
