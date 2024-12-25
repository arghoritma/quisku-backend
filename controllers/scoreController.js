const db = require("../services/db");

const saveQuizScore = async (req, res) => {
  try {
    const { quiz_id, score, xp_earned } = req.body;
    const user_id = req.uid;

    const [savedScore] = await db("user_quiz_scores")
      .insert({
        user_id,
        quiz_id,
        score,
        xp_earned,
      })
      .returning("*");

    res.json({
      message: "Quiz score saved successfully",
      code: "QUIZ_SCORE_SAVE_SUCCESS",
      data: savedScore,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getUserScores = async (req, res) => {
  try {
    const user_id = req.uid;

    const scores = await db("user_quiz_scores")
      .where({ user_id })
      .orderBy("completed_at", "desc");

    res.json({
      message: "User scores retrieved successfully",
      code: "USER_SCORES_RETRIEVAL_SUCCESS",
      data: scores,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await db("user_quiz_scores")
      .select("user_id")
      .sum("score as total_score")
      .sum("xp_earned as total_xp")
      .groupBy("user_id")
      .orderBy("total_score", "desc")
      .limit(10);

    res.json({
      message: "Global leaderboard retrieved successfully",
      code: "GLOBAL_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getCategoryLeaderboard = async (req, res) => {
  try {
    const { grade, subject } = req.params;

    const leaderboard = await db("user_quiz_scores")
      .join("quizzes", "user_quiz_scores.quiz_id", "quizzes.quiz_id")
      .join("users", "user_quiz_scores.user_id", "users.user_id")
      .where({
        "quizzes.grade": grade,
        "quizzes.subject": subject,
      })
      .select("users.user_id", "users.username", "users.profile_picture")
      .sum("user_quiz_scores.score as total_score")
      .sum("user_quiz_scores.xp_earned as total_xp")
      .groupBy("users.user_id", "users.username", "users.profile_picture")
      .orderBy("total_score", "desc")
      .limit(10);

    res.json({
      message: "Category leaderboard retrieved successfully",
      code: "CATEGORY_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user_id = req.uid;

    const stats = await db("user_quiz_scores")
      .where({ user_id })
      .select(
        db.raw("SUM(score) as total_score"),
        db.raw("SUM(xp_earned) as total_xp"),
        db.raw("COUNT(*) as quizzes_taken")
      )
      .first();

    res.json({
      message: "User stats retrieved successfully",
      code: "USER_STATS_RETRIEVAL_SUCCESS",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  saveQuizScore,
  getUserScores,
  getGlobalLeaderboard,
  getCategoryLeaderboard,
  getUserStats,
};
