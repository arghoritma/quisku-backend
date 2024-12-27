const { turso } = require("../configs/tursoDatabase");
const { v4: uuidv4 } = require("uuid");

const saveQuizScore = async (req, res) => {
  try {
    const { quiz_id, score, xp_earned } = req.body;
    const user_id = req.uid;
    const score_id = uuidv4();

    await turso.execute({
      sql: "INSERT INTO user_quiz_scores (score_id, user_id, quiz_id, score, xp_earned) VALUES (?, ?, ?, ?, ?)",
      args: [score_id, user_id, quiz_id, score, xp_earned],
    });

    res.json({
      message: "Quiz score saved successfully",
      code: "QUIZ_SCORE_SAVE_SUCCESS",
      data: { score_id, user_id, quiz_id, score, xp_earned },
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

    const { rows: scores } = await turso.execute({
      sql: "SELECT * FROM user_quiz_scores WHERE user_id = ? ORDER BY completed_at DESC",
      args: [user_id],
    });

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
    const { rows: leaderboard } = await turso.execute({
      sql: "SELECT user_id, SUM(score) as total_score, SUM(xp_earned) as total_xp FROM user_quiz_scores GROUP BY user_id ORDER BY total_score DESC LIMIT 10",
    });

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

    const { rows: leaderboard } = await turso.execute({
      sql: `
        SELECT 
          users.user_id, 
          users.username, 
          users.profile_picture,
          SUM(user_quiz_scores.score) as total_score,
          SUM(user_quiz_scores.xp_earned) as total_xp
        FROM user_quiz_scores
        JOIN quizzes ON user_quiz_scores.quiz_id = quizzes.quiz_id
        JOIN users ON user_quiz_scores.user_id = users.user_id
        WHERE quizzes.grade = ? AND quizzes.subject = ?
        GROUP BY users.user_id, users.username, users.profile_picture
        ORDER BY total_score DESC
        LIMIT 10
      `,
      args: [grade, subject],
    });

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

    const {
      rows: [stats],
    } = await turso.execute({
      sql: `
        SELECT 
          SUM(score) as total_score,
          SUM(xp_earned) as total_xp,
          COUNT(*) as quizzes_taken
        FROM user_quiz_scores
        WHERE user_id = ?
      `,
      args: [user_id],
    });

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
