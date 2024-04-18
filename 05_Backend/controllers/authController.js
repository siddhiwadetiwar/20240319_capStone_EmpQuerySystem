// Responsible for logic related to authentication

// External dependencies
// import bcrypt for password hashing
const bcrypt = require("bcrypt");
// Import jsonwebtoken for token generation
const jwt = require("jsonwebtoken");
// Load environment variables
require("dotenv").config();


// Internal dependencies
const User = require("../models/user");

// Importing validators for user input validation
const {
  usernameValidator,
  emailValidator,
  passwordValidator,
} = require("../dependencies/validators/user");


/** Function to signup a user
 * @param {Object} req - Request object containing user information
 * @param {Object} res - Response object to send back the result
 */
async function signup(req, res) {
  const { username, email, password } = req.body;

  // Validatinmg the user input
  if (
    !usernameValidator(username) ||
    !emailValidator(email) ||
    !passwordValidator(password)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Checking if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Duplicate key error handling
      return res.status(400).json({ message: 'Duplicate key error' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}


/** Function to signin a user
 * @param {Object} req - Request object containing user credentials
 * @param {Object} res - Response object to send back the result
 */
async function signin(req, res) {
  const { email, password } = req.body;

  // Validating the user input
  if (!emailValidator(email) || !passwordValidator(password)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Checking if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Checking if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Creating and assigning a JWT token for authentication
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });

    // Once the frontend and backend are connected,
    // the token will be sent in the response header
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/** Controller for logging out a user
 * @param {Object} req - Request object containing user session or access token
 * @param {Object} res - Response object to send back the result
 */
async function logout(req, res) {
  // Clear the user's session or access token
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

/** Controller for getting all Users
 * @param {Object} req - Request object
 * @param {Object} res - Response object to send back the result
 */
async function getAllUsers(req, res) {
  try {
    // Retrieve all posts from the database
    const posts = await User.find();
console.log(posts);
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Export the signup and signin functions for use in other files
module.exports = { signup, signin, logout,getAllUsers};
