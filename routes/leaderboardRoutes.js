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
