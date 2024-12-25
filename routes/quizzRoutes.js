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

module.exports = router;
