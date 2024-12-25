const db = require("../services/db");
const updateLeaderboard = async () => {
  try {
    // Get total scores and XP for each user
    const userStats = await db("user_quiz_scores")
      .select(
        "user_id",
        db.raw("SUM(score) as total_score"),
        db.raw("SUM(xp_earned) as total_xp")
      )
      .groupBy("user_id");

    // Calculate ranks and update/insert into leaderboard
    for (let i = 0; i < userStats.length; i++) {
      const rank = i + 1;
      await db.raw(
        `INSERT INTO leaderboard (user_id, total_score, total_xp, rank)
          VALUES (?, ?, ?, ?)
          ON CONFLICT ON CONSTRAINT leaderboard_pkey 
          DO UPDATE SET 
          total_score = EXCLUDED.total_score,
          total_xp = EXCLUDED.total_xp,
          rank = EXCLUDED.rank`,
        [
          userStats[i].user_id,
          userStats[i].total_score,
          userStats[i].total_xp,
          rank,
        ]
      );
    }
  } catch (error) {
    console.error("Failed to update leaderboard:", error);
    throw error;
  }
};

const getLeaderboard = async (req, res) => {
  try {
    await updateLeaderboard(); // Update leaderboard before fetching
    const leaderboard = await db("leaderboard")
      .select(
        "leaderboard.user_id",
        "users.username",
        "users.profile_picture",
        "leaderboard.total_score",
        "leaderboard.total_xp",
        "leaderboard.rank"
      )
      .leftJoin("users", "leaderboard.user_id", "users.user_id")
      .orderBy("rank", "asc")
      .limit(100);

    res.json({
      message: "Leaderboard retrieved successfully",
      code: "LEADERBOARD_RETRIEVAL_SUCCESS",
      data: leaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getSubjectLeaderboard = async (req, res) => {
  const { subject } = req.params;

  try {
    const subjectLeaderboard = await db("users")
      .select(
        "users.user_id",
        "users.username",
        "users.profile_picture",
        db.raw("SUM(user_quiz_scores.score) as subject_score"),
        db.raw("SUM(user_quiz_scores.xp_earned) as subject_xp")
      )
      .leftJoin("user_quiz_scores", "users.user_id", "user_quiz_scores.user_id")
      .leftJoin("quizzes", "user_quiz_scores.quiz_id", "quizzes.quiz_id")
      .where("quizzes.subject", subject)
      .groupBy("users.user_id", "users.username", "users.profile_picture")
      .orderBy("subject_xp", "desc")
      .orderBy("subject_score", "desc")
      .limit(100);

    res.json({
      message: "Subject leaderboard retrieved successfully",
      code: "SUBJECT_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: subjectLeaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const getGradeLeaderboard = async (req, res) => {
  const { grade } = req.params;

  try {
    const gradeLeaderboard = await db("users")
      .select(
        "users.user_id",
        "users.username",
        "users.profile_picture",
        db.raw("SUM(user_quiz_scores.score) as grade_score"),
        db.raw("SUM(user_quiz_scores.xp_earned) as grade_xp")
      )
      .leftJoin("user_quiz_scores", "users.user_id", "user_quiz_scores.user_id")
      .leftJoin("quizzes", "user_quiz_scores.quiz_id", "quizzes.quiz_id")
      .where("quizzes.grade", grade)
      .groupBy("users.user_id", "users.username", "users.profile_picture")
      .orderBy("grade_xp", "desc")
      .orderBy("grade_score", "desc")
      .limit(100);

    res.json({
      message: "Grade leaderboard retrieved successfully",
      code: "GRADE_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: gradeLeaderboard,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  getLeaderboard,
  getSubjectLeaderboard,
  getGradeLeaderboard,
  updateLeaderboard,
};
