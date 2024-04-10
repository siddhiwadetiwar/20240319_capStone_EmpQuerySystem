// Import Mongoose
const mongoose = require("mongoose");

// Define the schema for the Comment model
const commentSchema = new mongoose.Schema({
  // Comment ID (Primary Key)
//   commentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     // Each commentId must be unique
//     unique: true, 
//   },
  // Post ID referencing the postCollection model
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Reference to the postCollection model
    ref: "postCollection", 
  },
  // // User ID referencing the Users model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    // Reference to the user model
    ref: "user", 
  },
  // Content of the comment
  commentContent: {
    type: String,
    required: true,
  },
  // Date and time of the comment
  commentDateTime: {
    type: Date,
    default: Date.now,
  },
  // Number of upvotes for the comment
  upvotesCount: {
    type: Number,
    default: 0,
  },
  // Number of downvotes for the comment
  downvotesCount: {
    type: Number,
    default: 0,
  },
  // Indicates whether the comment is pinned
  isPinned: {
    type: Boolean,
    default: false,
  },
  upvotesCount: { 
    type: Number, 
    default: 0 
  },
  upvotedUsers: { 
    type: [mongoose.Schema.Types.ObjectId], 
    default: [] 
  },
  downvotesCount: { 
    type: Number, 
    default: 0 
  },
  downvotedUsers: { 
    type: [mongoose.Schema.Types.ObjectId], 
    default: [] 
  },
});

// Create and export the Comment model
module.exports = mongoose.model("Comment", commentSchema);
