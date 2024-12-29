const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/profile", updateUser);

module.exports = router;

// Documentations
/**
 * @controllers/usersController.js
 *
 * @route GET /
 * @desc Get all users
 * @access Public
 * @returns {array} 200 - Array of users
 * @returns {object} 500 - Server error
 *
 * @route GET /:id
 * @desc Get user by ID
 * @access Public
 * @param {string} id - User ID
 * @returns {object} 200 - User object
 * @returns {object} 404 - User not found
 * @returns {object} 500 - Server error
 *
 * @route POST /
 * @desc Create a new user
 * @access Public
 * @param {string} uid - Optional user ID (UUID will be generated if not provided)
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} full_name - User's full name
 * @param {string} phone - User's phone number
 * @param {string} profile_picture - User's profile picture URL
 * @returns {object} 201 - User created successfully
 * @returns {object} 500 - Server error
 *
 * @example
 * // POST Request body
 * {
 *   "username": "johndoe",
 *   "email": "john@example.com",
 *   "password": "123456",
 *   "full_name": "John Doe",
 *   "phone": "1234567890",
 *   "profile_picture": "https://example.com/profile.jpg"
 * }
 *
 * @route PUT /:id
 * @desc Update user by ID
 * @access Public
 * @param {string} id - User ID
 * @param {object} body - Fields to update
 * @returns {object} 200 - User updated successfully
 * @returns {object} 404 - User not found
 * @returns {object} 500 - Server error
 *
 * @route DELETE /:id
 * @desc Delete user by ID
 * @access Public
 * @param {string} id - User ID
 * @returns {object} 200 - User deleted successfully
 * @returns {object} 404 - User not found
 * @returns {object} 500 - Server error
 */
