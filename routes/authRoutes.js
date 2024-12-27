const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("full_name").not().isEmpty().withMessage("Full name is required"),
  ],
  authController.signup
);

module.exports = router;

// Documentations
/**
 * @controllers/authController.js
 *
 * @route POST /signup
 * @desc Register a new user
 * @access Public
 *
 * @param {string} username - User's username
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 6 characters)
 * @param {string} full_name - User's full name
 * @param {string} phone - User's phone number
 *
 * @returns {object} 201 - Registration success response
 * @returns {object} 400 - Validation errors or duplicate entry
 * @returns {object} 500 - Server error
 *
 * @example
 * // Request body
 * {
 *   "username": "johndoe",
 *   "email": "john@example.com",
 *   "password": "123456",
 *   "full_name": "John Doe",
 *   "phone": "1234567890"
 * }
 *
 * // Success response - 201
 * {
 *   "message": "User registered successfully",
 *   "code": "REGISTRATION_SUCCESS",
 *   "uid": "user-uuid"
 * }
 *
 * // Error response - 400
 * {
 *   "message": "Email or phone number already in use",
 *   "code": "DUPLICATE_ENTRY"
 * }
 *
 * // Error response - 500
 * {
 *   "error": "Error message",
 *   "code": "UNKNOWN_ERROR"
 * }
 */
