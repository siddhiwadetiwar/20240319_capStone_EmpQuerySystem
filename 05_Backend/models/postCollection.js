// Import Mongoose
const mongoose = require("mongoose");

// Define the schema for the PostCollection model
const postCollectionSchema = new mongoose.Schema({
  
  // Array of strings for post content
  postContent: {
    // postContent is an array of strings
    type: [String], 
    required: true,
  },
  // Type of post (e.g., educational, entertainment, personal)
  postType: {
    type: String,
    required: true,
  },
  // Date and time of the post, defaults to the current timestamp
  postDateTime: {
    type: Date,
    default: Date.now,
  },
  // Number of upvotes for the post, defaults to 0
  upvotesCount: {
    type: Number,
    default: 0,
  },
  // Number of downvotes for the post, defaults to 0
  downvotesCount: {
    type: Number,
    default: 0,
  },
  // Array of strings representing image URLs associated with the post
  images: {
    // images is an array of strings (image URLs)
    type: [String],
  },
  comments: [{
    // type: mongoose.Schema.Types.ObjectId,
    type: [Object],
    ref: "comment",
  }],
  upvotedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  downvotedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    // Reference to the user model
    ref: "user", 
  },
});

// Create and export the PostCollection model
module.exports = mongoose.model("PostCollection", postCollectionSchema);
