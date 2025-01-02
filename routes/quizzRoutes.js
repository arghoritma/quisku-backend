const express = require("express");
const quizzController = require("../controllers/quizzControllers");

const router = express.Router();

// Generate quiz route
router.post("/generate", quizzController.generateQuiz);

// Get quiz by ID route
router.get("/:quizId", quizzController.getQuiz);

// Get quizzes with filters route
router.get("/", quizzController.getQuizzes);

// Get user's quizzes route
router.get("/user/quizzes", quizzController.getUserQuizzes);

// Get latest quizzes route
router.get("/latest", quizzController.getLatestQuizzes);
module.exports = router;

// Documentations
/**
 * @controllers/quizzControllers.js
 *
 * @route POST /generate
 * @desc Generate a new quiz using Gemini AI
 * @access Private
 * @param {string} grade - Grade level for the quiz
 * @param {string} subject - Subject for the quiz
 * @returns {object} 200 - Generated quiz object
 * @returns {object} 500 - Server error
 *
 * @example
 * // POST Request body
 * {
 *   "grade": "10",
 *   "subject": "Mathematics"
 * }
 *
 * @route GET /:quizId
 * @desc Get quiz by ID
 * @access Public
 * @param {string} quizId - Quiz ID
 * @returns {object} 200 - Quiz object
 * @returns {object} 404 - Quiz not found
 * @returns {object} 500 - Server error
 *
 * @route GET /
 * @desc Get quizzes with optional filters
 * @access Public
 * @param {string} grade - Optional grade filter
 * @param {string} subject - Optional subject filter
 * @returns {array} 200 - Array of quiz objects
 * @returns {object} 500 - Server error
 *
 * @example
 * // GET Query parameters
 * /quizzes?grade=10&subject=Mathematics
 *
 * @route GET /user/quizzes
 * @desc Get quizzes created by authenticated user
 * @access Private
 * @returns {array} 200 - Array of user's quiz objects
 * @returns {object} 500 - Server error
 */
