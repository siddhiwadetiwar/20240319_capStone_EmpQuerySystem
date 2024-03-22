const express = require("express");
const router = express.Router();

// Controller
const authController = require("../controllers/authController");

// Routes
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);



// Exporting the router
module.exports = router;
