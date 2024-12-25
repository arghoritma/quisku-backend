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
