const express = require("express");
const router = express.Router();
const {
  saveQuizScore,
  getUserScores,
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserStats,
} = require("../controllers/scoreController");

// Save quiz score
router.post("/", saveQuizScore);

// Get user scores
router.get("/user/:user_id", getUserScores);

// Get global leaderboard
router.get("/leaderboard", getGlobalLeaderboard);

// Get category leaderboard
router.get("/leaderboard/:category", getCategoryLeaderboard);

// Get user stats
router.get("/stats/:user_id", getUserStats);

module.exports = router;

// Documentation
/**
 * @controllers/scoreController.js
 *
 * @route POST /
 * @desc Save quiz score for a user
 * @access Private
 * @param {string} quiz_id - Quiz ID
 * @param {number} score - Quiz score
 * @param {number} xp_earned - XP earned from quiz
 * @returns {object} 200 - Score saved successfully
 * @returns {object} 500 - Server error
 *
 * @example
 * // POST Request body
 * {
 *   "quiz_id": "uuid-string",
 *   "score": 85,
 *   "xp_earned": 100
 * }
 *
 * @route GET /user/:user_id
 * @desc Get all scores for a specific user
 * @access Private
 * @param {string} user_id - User ID
 * @returns {array} 200 - Array of user scores
 * @returns {object} 500 - Server error
 *
 * @route GET /leaderboard
 * @desc Get global leaderboard
 * @access Public
 * @returns {array} 200 - Array of top 10 users with highest scores
 * @returns {object} 500 - Server error
 *
 * @route GET /leaderboard/:category
 * @desc Get category-specific leaderboard
 * @access Public
 * @param {string} grade - Grade level
 * @param {string} subject - Subject name
 * @returns {array} 200 - Array of top 10 users in specific category
 * @returns {object} 500 - Server error
 *
 * @route GET /stats/:user_id
 * @desc Get statistics for a specific user
 * @access Private
 * @param {string} user_id - User ID
 * @returns {object} 200 - User statistics object
 * @returns {object} 500 - Server error
 */
