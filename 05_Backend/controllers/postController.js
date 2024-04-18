// Importing the Comment model
const Comment = require("../models/comment");

// Importing the PostCollection model
const PostCollection = require("../models/postCollection");

// Importing the User model
const User = require('../models/user');

// Importing mongoose for database operations
const mongoose = require("mongoose");

// Importing validators for post data validation
const {
  postContentValidator,
  postTypeValidator,
  imagesValidator,
  upvotesCountValidator,
  downvotesCountValidator,
  usernameValidator,
} = require('../dependencies/validators/post')

/** Controller for adding a post
 * @param {Object} req - Request object containing post data
 * @param {Object} res - Response object to send back the result
 */
async function addPost(req, res) {
  // Extracting data from the request body
  const {
    postContent,
    postType,
    images,
  } = req.body;

  

  // Creating a new post object
  const post = new PostCollection({
    postContent,
    postType,
    images,
    userId: req.user._id,
  });
  

  try {
    // Validate the post content
    if (!postContentValidator(postContent)) {
      return res.status(400).json({ error: 'Invalid post content' });
    }

    // Validate the post type
    if (!postTypeValidator(postType)) {
      return res.status(400).json({ error: 'Invalid post type' });
    }

    // Validate the images array
    if (!imagesValidator(images)) {
      return res.status(400).json({ error: 'Invalid images array' });
    }

    // Saving the post to the database
    const savedPost = await post.save();
    return res.status(200).json({ post: savedPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Controller for getting all posts
 * @param {Object} req - Request object
 * @param {Object} res - Response object to send back the result
 */
async function getAllPosts(req, res) {
  try {
    // Retrieve all posts from the database, sorted by postDateTime descending
    const posts = await PostCollection.find().sort({ postDateTime: -1 }).populate("userId","username");

    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Controller to search posts by username
 * @param {Object} req - Request object containing username
 * @param {Object} res - Response object to send back the result
 */
async function getAllPostsByUsername(req, res) {
  try {
    // Extract username from the request body 
    const { username } = req.params; 

    // Validate the username format 
    if (!usernameValidator(username)) {
      return res.status(400).json({ message: 'Invalid username format' });
    }

    // Find the user based on the username
    const user = await User.findOne({ username });
    console.log('Found user:', user); // Add this log statement
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all posts of the user using their userId
    const postss = await PostCollection.find({ userId: user._id }).sort({ postDateTime: -1 });

    // Transform posts data for response
    const posts = postss.map(post => ({
      postContent: post.postContent,
      postType: post.postType,
      postDateTime: post.postDateTime,
      upvotesCount: post.upvotesCount,
      downvotesCount: post.downvotesCount,
      images: post.images,
      comments: post.comments,
      upvotedUsers: post.upvotedUsers,
      downvotedUsers: post.downvotedUsers,
      userId: post.userId,
      userName: user.username // Include the username here
    }));

    // Return the posts as a JSON response
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts by username:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


async function deletePostsById(req, res) {
  const postId = req.params.postId;

  try {
    // Find the post by its ID and delete it
    const deletedPost = await PostCollection.findByIdAndDelete(postId);

    if (!deletedPost) {
      // If the post with the provided ID doesn't exist, return a 404 status
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Return a success message
    return res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    // If an error occurs, return a 500 status and the error message
    return res.status(500).json({ error: error.message });
  }
};

/** Controller to get filtered posts based on type of educational, entertainment
 * and personal.
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function getFilteredPosts(req, res) {
  // Extract postType from query parameters
  const { postType } = req.query;

  // Validate the post type
  if (!postTypeValidator(postType)) {
    return res.status(400).json({ error: 'Invalid post type' });
  }

  try {
    let filter = {};
    if (postType) {
      // If a postType is provided, create a filter based on the postType
      filter = { postType };
    }

    // Find posts based on the filter
    const posts = await PostCollection.find(filter).sort({ postDateTime: -1 }).populate("userId","username");

    // Return filtered posts as a JSON response
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching filtered posts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Controller to upvote a post and get count and not let the same user upvote again
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function upvotePostAndGetCount(req, res) {
  // Extract postId from request parameters and user ID from req.user
  const { postId } = req.params;
  const userId = req.user._id; // Assuming user ID is available in req.user after authentication

  try {
    // Check if the post exists
    const post = await PostCollection.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already upvoted this post
    if (post.upvotedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User has already upvoted this post' });
    }

    //  to validate upvotes count
    if (!upvotesCountValidator(post.upvotesCount)) {
      return res.status(400).json({ message: 'Invalid upvotes count' });
    }
    // Increment the upvotesCount and add the user ID to the upvotedUsers array
    post.upvotesCount++;
    post.upvotedUsers.push(userId);
    await post.save();

    // Return the updated count of upvotes
    return res.status(200).json({ message: 'Post upvoted successfully', upvotesCount: post.upvotesCount });
  } catch (error) {
    console.error('Error upvoting post and getting count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Controller to downvote a post and get count and not let the same user downvote again
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function downvotePostAndGetCount(req, res) {
  // Extract postId from request parameters and user ID from req.user
  const { postId } = req.params;
  const userId = req.user._id; // Assuming user ID is available in req.user after authentication



  try {
    // Check if the post exists
    const post = await PostCollection.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already downvoted this post
    if (post.downvotedUsers.includes(userId)) {
      return res.status(400).json({ message: 'User has already downvoted this post' });
    }

    // to validate downvotes count
    if (!downvotesCountValidator(post.downvotesCount)) {
      return res.status(400).json({ message: 'Invalid downvotes count' });
    }

    // Increment the downvotesCount and add the user ID to the downvotedUsers array
    post.downvotesCount++;
    post.downvotedUsers.push(userId);
    await post.save();

    // Return the updated count of downvotes
    return res.status(200).json({ message: 'Post downvoted successfully', downvotesCount: post.downvotesCount });
  } catch (error) {
    console.error('Error downvoting post and getting count:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addPost,
  getAllPosts,
  getAllPostsByUsername,
  getFilteredPosts,
  upvotePostAndGetCount,
  downvotePostAndGetCount,
  deletePostsById
};
