const { turso } = require("../configs/tursoDatabase");

const updateLeaderboard = async () => {
  try {
    // Get total scores and XP for each user
    const userStats = await turso.execute(`
      SELECT user_id, 
             SUM(score) as total_score,
             SUM(xp_earned) as total_xp
      FROM user_quiz_scores
      GROUP BY user_id
    `);

    // Calculate ranks and update/insert into leaderboard
    for (let i = 0; i < userStats.rows.length; i++) {
      const rank = i + 1;
      await turso.execute(
        `
        INSERT INTO leaderboard (user_id, total_score, total_xp, rank)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET 
        total_score = EXCLUDED.total_score,
        total_xp = EXCLUDED.total_xp,
        rank = EXCLUDED.rank
      `,
        [
          userStats.rows[i].user_id,
          userStats.rows[i].total_score,
          userStats.rows[i].total_xp,
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
    const leaderboard = await turso.execute(`
      SELECT l.user_id, u.username, u.profile_picture, 
             l.total_score, l.total_xp, l.rank
      FROM leaderboard l
      LEFT JOIN users u ON l.user_id = u.user_id
      ORDER BY rank ASC
      LIMIT 100
    `);

    res.json({
      message: "Leaderboard retrieved successfully",
      code: "LEADERBOARD_RETRIEVAL_SUCCESS",
      data: leaderboard.rows,
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
    const subjectLeaderboard = await turso.execute(
      `
      SELECT u.user_id, u.username, u.profile_picture,
             SUM(uqs.score) as subject_score,
             SUM(uqs.xp_earned) as subject_xp
      FROM users u
      LEFT JOIN user_quiz_scores uqs ON u.user_id = uqs.user_id
      LEFT JOIN quizzes q ON uqs.quiz_id = q.quiz_id
      WHERE q.subject = ?
      GROUP BY u.user_id, u.username, u.profile_picture
      ORDER BY subject_xp DESC, subject_score DESC
      LIMIT 100
    `,
      [subject]
    );

    res.json({
      message: "Subject leaderboard retrieved successfully",
      code: "SUBJECT_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: subjectLeaderboard.rows,
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
    const gradeLeaderboard = await turso.execute(
      `
      SELECT u.user_id, u.username, u.profile_picture,
             SUM(uqs.score) as grade_score,
             SUM(uqs.xp_earned) as grade_xp
      FROM users u
      LEFT JOIN user_quiz_scores uqs ON u.user_id = uqs.user_id
      LEFT JOIN quizzes q ON uqs.quiz_id = q.quiz_id
      WHERE q.grade = ?
      GROUP BY u.user_id, u.username, u.profile_picture
      ORDER BY grade_xp DESC, grade_score DESC
      LIMIT 100
    `,
      [grade]
    );

    res.json({
      message: "Grade leaderboard retrieved successfully",
      code: "GRADE_LEADERBOARD_RETRIEVAL_SUCCESS",
      data: gradeLeaderboard.rows,
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
    const userStats = await turso.execute(
      `
      SELECT 
        u.user_id,
        u.username,
        SUM(uqs.score) as total_score,
        SUM(uqs.xp_earned) as total_xp,
        COUNT(DISTINCT uqs.quiz_id) as completed_quizzes
      FROM users u
      LEFT JOIN user_quiz_scores uqs ON u.user_id = uqs.user_id
      WHERE u.user_id = ?
      GROUP BY u.user_id, u.username
    `,
      [req.uid]
    );

    res.json({
      message: "User stats retrieved successfully",
      code: "USER_STATS_RETRIEVAL_SUCCESS",
      data: userStats.rows[0],
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
  getUserStats,
};
