// Responsible for logic related to authentication

// External dependencies

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");
// Import jsonwebtoken for token generation
const jwt = require("jsonwebtoken");
// Load environment variables
require("dotenv").config();

// Internal dependencies
const User = require("../models/user");
const {
  usernameValidator,
  emailValidator,
  passwordValidator,
} = require("../dependencies/validators/user");




/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with the provided username, email, password, and role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *       '400':
 *         description: Invalid input or user already exists
 *       '500':
 *         description: Internal server error
 */

/** function to signup user 
 * @param {Object} req - request object
 * @param {Object} req - request object
*/
async function signup(req, res) {
  const { username, email, password } = req.body;

  // Validate the user input
  if (
    !usernameValidator(username) ||
    !emailValidator(email) ||
    !passwordValidator(password)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
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



/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login a user
 *     description: Authenticate the user with the provided email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *       '400':
 *         description: Invalid input or invalid email/password
 *       '500':
 *         description: Internal server error
 */


/** function to signin user 
 * @param {Object} req - request object
 * @param {Object} res - request object
*/
async function signin(req, res) {
  const { email, password } = req.body;

  // Validate the user input
  if (!emailValidator(email) || !passwordValidator(password)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });

    // Send the token in the response Body
    // Once the frontend and backend are connected,
    // the token will be sent in the response header
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Export the signup and signin functions for use in other files
module.exports = { signup, signin };
