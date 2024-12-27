const { model } = require("../configs/geminiConfigs");
const { turso } = require("../configs/tursoDatabase");
const { cleanJsonString, convertJSON } = require("../utils/helpers");
const { v4: uuidv4 } = require("uuid");

const quizzController = {
  // Generate quiz using Gemini AI
  async generateQuiz(req, res) {
    try {
      const { grade, subject } = req.body;
      const userId = req.user.uid; // From auth middleware

      // Prompt for Gemini to generate quiz
      const prompt = `Buatkan kuis dengan 10 pertanyaan pilihan ganda tentang ${subject} untuk tingkat ${grade}. 
                      Format jawaban dalam bentuk array JSON dengan objek yang berisi:
                      - question (string berisi pertanyaan)
                      - options (array berisi 4 string pilihan jawaban)
                      - correct_answer (string berisi jawaban yang benar)
                      - jangan tambahkan komentar atau penjelasan lainnya
                      - jawaban harus plaintext berupa format JSON yang valid`;

      const result = await model.generateContent(prompt);
      const questions = result.response.text();
      const reformat = cleanJsonString(questions);
      const Questions = convertJSON(reformat);
      console.log(questions);

      console.log(questions, Questions);
      // Save quiz to database
      const quizId = uuidv4();
      await turso.execute({
        sql: "INSERT INTO quizzes (quiz_id, grade, subject, questions, created_by) VALUES (?, ?, ?, ?, ?)",
        args: [quizId, grade, subject, JSON.stringify(Questions), userId],
      });

      const quiz = {
        quiz_id: quizId,
        grade,
        subject,
        questions: Questions,
        created_by: userId,
      };

      res.json({
        message: "Quiz generated successfully",
        code: "QUIZ_GENERATION_SUCCESS",
        data: quiz,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        code: "UNKNOWN_ERROR",
      });
    }
  },

  // Get quiz by ID
  async getQuiz(req, res) {
    try {
      const { quizId } = req.params;

      const result = await turso.execute({
        sql: "SELECT * FROM quizzes WHERE quiz_id = ?",
        args: [quizId],
      });

      if (!result.rows[0]) {
        return res.status(404).json({
          message: "Quiz not found",
          code: "QUIZ_NOT_FOUND",
        });
      }

      res.json({
        message: "Quiz retrieved successfully",
        code: "QUIZ_RETRIEVAL_SUCCESS",
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        code: "UNKNOWN_ERROR",
      });
    }
  },

  // Get quizzes by filters
  async getQuizzes(req, res) {
    try {
      const { grade, subject } = req.query;

      let sql = "SELECT * FROM quizzes";
      const args = [];
      const conditions = [];

      if (grade) {
        conditions.push("grade = ?");
        args.push(grade);
      }
      if (subject) {
        conditions.push("subject = ?");
        args.push(subject);
      }

      if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
      }
      sql += " ORDER BY created_at DESC";

      const result = await turso.execute({
        sql,
        args,
      });

      res.json({
        message: "Quizzes retrieved successfully",
        code: "QUIZZES_RETRIEVAL_SUCCESS",
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        code: "UNKNOWN_ERROR",
      });
    }
  },

  // Get quizzes created by user
  async getUserQuizzes(req, res) {
    try {
      const userId = req.user.uid;

      const result = await turso.execute({
        sql: "SELECT * FROM quizzes WHERE created_by = ? ORDER BY created_at DESC",
        args: [userId],
      });

      res.json({
        message: "User quizzes retrieved successfully",
        code: "USER_QUIZZES_RETRIEVAL_SUCCESS",
        data: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        code: "UNKNOWN_ERROR",
      });
    }
  },
};

module.exports = quizzController;
