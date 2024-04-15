// Responsible for logic related to authentication

// External dependencies

const nodemailer = require('nodemailer');

// Import bcrypt for password hashing
const bcrypt = require("bcrypt");
// Import jsonwebtoken for token generation
const jwt = require("jsonwebtoken");
// Load environment variables
require("dotenv").config();


const { v4: uuidv4 } = require('uuid');

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
    return res.status(400).json({ message: "Enter valid details" });
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

// // Function to generate a unique reset token
// function generateResetToken() {
//   return uuidv4(); // Generate a version 4 UUID as the reset token
// }

// /** function to handle forgot password request
//  * @param {Object} req - request object
//  * @param {Object} res - response object
//  */
// async function forgotPassword(req, res) {
//   const  email  = req.body.email;

//   // Validate the user input
//   if (!emailValidator(email)) {
//     return res.status(400).json({ message: "Invalid email" });
//   }

//   try {
//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Generate a unique token for password reset (e.g., using uuid or any other method)
//     const resetToken = generateResetToken();

//     // Update the user document with the reset token and expiry date
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 3600000; // Token expiry in 1 hour
//     await user.save();

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: '@gmail.com',
//         pass: 'your-email-password',
//       },
//       debug: true, // Enable debug mode
//     });
    
//     const mailOptions = {
//       from: 'wadetiwarsd@rknec.edu',
//       to: email,
//       subject: 'Password Reset',
//       html: `<p>Dear user,</p>
//              <p>Please click <a href="http://your-app/reset-password/${resetToken}">here</a> to reset your password.</p>`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending reset email:', error);
//         return res.status(500).json({ message: 'Failed to send password reset email' });
//       }
//       console.log('Password reset email sent:', info.response);
//       res.status(200).json({ message: 'Password reset email sent successfully' });
//     });
//   } catch (error) {
//     console.error('Error in forgotPassword:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }

/** Controller for logging out a user
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
async function logout(req, res) {
  // Clear the user's session or access token
  // For example, if using sessions:
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

/** Comtroller for getting all Users
 * @param {Object} req - request object
 * @param {Object} res - request object
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
