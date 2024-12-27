const { turso } = require("../configs/tursoDatabase.js");

async function initializeDatabase() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        full_name TEXT,
        phone TEXT,
        profile_picture TEXT,
        total_score INTEGER,
        total_xp INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS quizzes (
        quiz_id TEXT PRIMARY KEY,
        grade TEXT CHECK (grade IN ('SD-Kelas-1', 'SD-Kelas-2', 'SD-Kelas-3', 'SD-Kelas-4', 'SD-Kelas-5', 'SD-Kelas-6', 'SMP-Kelas-7', 'SMP-Kelas-8', 'SMP-Kelas-9', 'SMA-Kelas-10', 'SMA-Kelas-11', 'SMA-Kelas-12', 'S1', 'S2')),
        subject TEXT CHECK (subject IN ('Bahasa Indonesia', 'Sains', 'Matematika', 'Sejarah', 'Geografi', 'Fisika', 'Kimia', 'Biologi', 'Pesantren')),
        questions JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT,
        FOREIGN KEY (created_by) REFERENCES users(user_id)
      )`);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS user_quiz_scores (
        score_id TEXT PRIMARY KEY,
        user_id TEXT,
        quiz_id TEXT,
        score INTEGER,
        xp_earned INTEGER,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id),
        FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id)
      )`);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        leaderboard_id TEXT PRIMARY KEY,
        user_id TEXT,
        total_score INTEGER,
        total_xp INTEGER,
        rank INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      )`);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

module.exports = { initializeDatabase };
