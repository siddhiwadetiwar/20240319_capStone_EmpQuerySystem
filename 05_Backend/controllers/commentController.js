// Importing the Comment model
const Comment = require("../models/comment");

// Importing the PostCollection model
const PostCollection = require("../models/postCollection");

// Importing the User model
const User = require('../models/user');

// Importing validator for comment content
const {
    commentContentValidator,
} = require('../dependencies/validators/post')

/** Controller for adding a comment to a post
 * @param {Object} req - Request object containing post ID and comment content
 * @param {Object} res - Response object to send back the result
 */
async function addComment(req, res) {
    console.log(req.params.postId);
    let postId = '';
    // Extract postId from the request
    if (req.params.postId) {
        postId = req.params.postId;
    } else if (req.query.postId) {
        postId = req.query.postId;
    } else {
        return res.status(400).json({ message: 'postId is required' });
    }

    const { commentContent } = req.body;

    // Assuming user ID is available in req.user
    const userId = req.user._id;

    // Validating comment content
    if (!commentContentValidator(commentContent)) {
        return res.status(400).json({ message: 'Invalid comment content' });
    }

    try {
        // Checking if the post exists
        const post = await PostCollection.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Creating a new comment
        const comment = new Comment({
            postId,
            userId,
            commentContent
        });

        // Save the comment to the database
        console.log(comment);
        const savedComment = await comment.save();

        // Update the post to include the comment
        post.comments.push(savedComment);

        await post.save();

        return res.status(200).json({ comment: savedComment });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/** Controller to get all comments
 * @param {Object} req - Request object
 * @param {Object} res - Response object to send back the result
 */
async function getAllComments(req, res) {
    try {
        // Retrieve all comments from the database
        const comments = await Comment.find().sort({ commentDateTime: -1 }).populate("userId", "username");
        return res.status(200).json({ comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/** Controller to upvote a comment and get count, ensuring the same user cannot upvote twice
 * @param {Object} req - Request object containing comment ID
 * @param {Object} res - Response object to send back the result
 */
async function upvoteCommentAndGetCount(req, res) {
    // Extracting commentId from request parameters and user ID from req.user
    const { commentId } = req.params;
    const userId = req.user._id; 
    // Check if the user has already upvoted this comment
    try {
        // Find the comment by its ID
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user has already upvoted this comment
        if (comment.upvotedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User has already upvoted this comment' });
        }


        // Incrementing the upvotesCount and add the user ID to the upvotedUsers array
        comment.upvotesCount++;
        comment.upvotedUsers.push(userId);

        // Save the updated comment back to the database
        await comment.save();

        // Return the updated count of upvotes for the comment
        return res.status(200).json({ message: 'Comment upvoted successfully', upvotesCount: comment.upvotesCount });
    } catch (error) {
        console.error('Error upvoting comment and getting count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/** Controller to downvote a comment and get count, ensuring the same user cannot downvote twice
 * @param {Object} req - Request object containing comment ID
 * @param {Object} res - Response object to send back the result
 */
async function downvoteCommentAndGetCount(req, res) {
    // Extract commentId from request parameters and user ID from req.user
    const { commentId } = req.params;
    const userId = req.user._id; 

    try {
        // Check if the comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user has already downvoted this comment
        if (comment.downvotedUsers.includes(userId)) {
            return res.status(400).json({ message: 'User has already downvoted this comment' });
        }

        // Increment the downvotesCount and add the user ID to the downvotedUsers array
        comment.downvotesCount++;
        comment.downvotedUsers.push(userId);
        await comment.save();

        // Return the updated count of downvotes for the comment
        return res.status(200).json({ message: 'Comment downvoted successfully', downvotesCount: comment.downvotesCount });
    } catch (error) {
        console.error('Error downvoting comment and getting count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


/** Controller for pinning a comment
 * @param {Object} req - Request object containing comment ID
 * @param {Object} res - Response object to send back the result
 */
const pinComment = async (req, res) => {

    // Extracting userId from the authenticated user object
    const userId = req.user._id;
    // Extracting commentId from request parameters
    const { commentId } = req.params;

    try {
        // Check if the comment exists and is authored by the user
        const comment = await Comment.findOne({ _id: commentId, userId });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Pin the comment by setting isPinned to true
        comment.isPinned == true ? comment.isPinned = false : comment.isPinned = true;
        await comment.save();

        return res.status(200).json({ message: 'Comment pinned successfully' });
    } catch (error) {
        console.error('Error pinning comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    pinComment,
    addComment,
    getAllComments,
    upvoteCommentAndGetCount,
    downvoteCommentAndGetCount,
};
