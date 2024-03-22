const express = require("express");
const router = express.Router();

// Import the auth controller
const authController = require("../controllers/authController");

// Route for user signup
router.post("/signup", authController.signup);

// Route for user signin
router.post("/signin", authController.signin);

// Route for resetting password
router.post("/logout", authController.logout);

// Export the router
module.exports = router;
