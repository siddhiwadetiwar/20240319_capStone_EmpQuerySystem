// Importing the Comment model
const Comment = require("../models/comment");

// Importing the PostCollection model
const PostCollection = require("../models/postCollection");

// Importing the User model
const User = require('../models/user');

const {
  postContentValidator,
  postTypeValidator,
  imagesValidator,
  upvotesCountValidator,
  downvotesCountValidator,
  commentContentValidator,
  usernameValidator,
} = require('../dependencies/validators/post')


/** Controller for pinning a comment
 *  @param {Object} req - request object
 *  @param {Object} res - request object
 */
const pinComment = async (req, res) => {
  // Extracting userId from the authenticated user object
  const { userId } = req.user._id;

  // Extracting postId and commentId from request parameters
  const { postId, commentId } = req.params;

  try {
    // Check if the user is the author of the post
    const post = await PostCollection.findOne({ postId, userId });
    if (!post) {
      return res.status(401).json({ message: 'Unauthorized - User is not the author of the post' });
    }

    // Check if the comment exists and is upvoted by the author
    const comment = await Comment.findOne({ _id: commentId, userId });
    if (!comment || comment.upvotesCount === 0) {
      return res.status(400).json({ message: 'Invalid request - Comment not found or not upvoted' });
    }

    // Pin the comment by setting isPinned to true
    comment.isPinned = true;
    await comment.save();

    return res.status(200).json({ message: 'Comment pinned successfully' });
  } catch (error) {
    console.error('Error pinning comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/** Controller for adding a post
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function addPost(req, res) {
  // Extracting data from the request body
  const {
    postContent,
    postType,
    images
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

/** Comtroller for getting all posts
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function getAllPosts(req, res) {
  try {
    // Retrieve all posts from the database
    const posts = await PostCollection.find();

    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Controller for adding a comment to a post
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function addComment(req, res) {
  // Extracting postId from the request
  postId = [];

  if (req.params.postId) {
    postId = req.params.postId;
  } else if (req.query.postId) {
    postId = req.query.postId;
  } else {
    return res.status(400).json({ message: 'postId is required' });
  }
  const { commentContent } = req.body;
  const userId = req.user._id; // Assuming user ID is available in req.user

  // Validate comment content
  if (!commentContentValidator(commentContent)) {
    return res.status(400).json({ message: 'Invalid comment content' });
  }

  try {
    // Check if the post exists
    const post = await PostCollection.findById(postId, userId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment
    const comment = new Comment({
      postId,
      userId,
      commentContent,
    });

    // Save the comment to the database
    const savedComment = await comment.save();

    // Update the post to include the comment
    post.comments.push(savedComment._id);
    await post.save();

    return res.status(201).json({ comment: savedComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// async function getAllPostsByUsername(req, res) {
//   try {
//     // Extract the username from the request parameters
//     const { username } = req.params;

//     // Find the user based on the username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find all posts of the user using their userId
//     const posts = await PostCollection.find({ userId: user._id });

//     // Return the posts as a JSON response
//     return res.status(200).json({ posts });
//   } catch (error) {
//     console.error('Error fetching posts by username:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

/** Controller to search by username
 * @param {Object} req - request object
 * @param {Object} res - request object
 */
async function getAllPostsByUsername(req, res) {
  // Extract username from request body
  const { username } = req.body;

  // Validate the username
  if (!usernameValidator(username)) {
    return res.status(400).json({ message: 'Invalid username format' });
  }

  try {
    // Find the user based on the username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all posts of the user using their userId
    const posts = await PostCollection.find({ userId: user._id });

    // Return the posts as a JSON response
    return res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts by username:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

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
    const posts = await PostCollection.find(filter);

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

  //  to validate upvotes count
  if (!upvotesCountValidator(post.upvotesCount)) {
    return res.status(400).json({ message: 'Invalid upvotes count' });
  }


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

  // to validate downvotes count
  if (!downvotesCountValidator(post.downvotesCount)) {
    return res.status(400).json({ message: 'Invalid downvotes count' });
  }

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
  pinComment,
  addPost,
  addComment,
  getAllPosts,
  getAllPostsByUsername,
  getFilteredPosts,
  upvotePostAndGetCount,
  downvotePostAndGetCount,
};
