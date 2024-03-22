// Import Mongoose
const mongoose = require("mongoose");

// Define the schema for the Users model
const userSchema = new mongoose.Schema({
  // User ID (Primary Key)
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: false,
//     // Each userId must be unique
//     unique: true, 
//   },
  // Username of the user
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Email of the user
  email: {
    type: String,
    required: true,
    // Each email must be unique
    unique: true, 
  },
  // Password of the user
  password: {
    type: String,
    required: true,
  },
});

// Create and export the Users model
module.exports = mongoose.model("user", userSchema);
