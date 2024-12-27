const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getSubjectLeaderboard,
  getGradeLeaderboard,
} = require("../controllers/leaderboardController");

router.get("/", getLeaderboard);
router.get("/subject/:subject", getSubjectLeaderboard);
router.get("/grade/:grade", getGradeLeaderboard);

module.exports = router;

// Documentations
/**
 * @controllers/leaderboardController.js
 *
 * @route GET /
 * @desc Get global leaderboard data
 * @access Public
 * @returns {object} 200 - Leaderboard data with user details
 * @returns {object} 500 - Server error
 *
 * @example
 * // Response format
 * {
 *   "message": "Leaderboard retrieved successfully",
 *   "code": "LEADERBOARD_RETRIEVAL_SUCCESS",
 *   "data": [
 *     {
 *       "user_id": "123",
 *       "username": "johndoe",
 *       "profile_picture": "https://example.com/profile.jpg",
 *       "total_score": 1000,
 *       "total_xp": 500,
 *       "rank": 1
 *     }
 *   ]
 * }
 *
 * @route GET /subject/:subject
 * @desc Get subject-specific leaderboard
 * @access Public
 * @param {string} subject - Subject name
 * @returns {object} 200 - Subject leaderboard data
 * @returns {object} 500 - Server error
 *
 * @example
 * // Response format
 * {
 *   "message": "Subject leaderboard retrieved successfully",
 *   "code": "SUBJECT_LEADERBOARD_RETRIEVAL_SUCCESS",
 *   "data": [
 *     {
 *       "user_id": "123",
 *       "username": "johndoe",
 *       "profile_picture": "https://example.com/profile.jpg",
 *       "subject_score": 300,
 *       "subject_xp": 150
 *     }
 *   ]
 * }
 *
 * @route GET /grade/:grade
 * @desc Get grade-specific leaderboard
 * @access Public
 * @param {string} grade - Grade level
 * @returns {object} 200 - Grade leaderboard data
 * @returns {object} 500 - Server error
 *
 * @example
 * // Response format
 * {
 *   "message": "Grade leaderboard retrieved successfully",
 *   "code": "GRADE_LEADERBOARD_RETRIEVAL_SUCCESS",
 *   "data": [
 *     {
 *       "user_id": "123",
 *       "username": "johndoe",
 *       "profile_picture": "https://example.com/profile.jpg",
 *       "grade_score": 400,
 *       "grade_xp": 200
 *     }
 *   ]
 * }
 */
