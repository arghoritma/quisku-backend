const { model } = require("../configs/geminiConfigs");
const db = require("../services/db");
const { cleanJsonString, convertJSON } = require("../utils/helpers");

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
      const [quiz] = await db("quizzes")
        .insert({
          grade,
          subject,
          questions: JSON.stringify(Questions),
          created_by: userId,
        })
        .returning("*");

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

      const quiz = await db("quizzes").where({ quiz_id: quizId }).first();

      if (!quiz) {
        return res.status(404).json({
          message: "Quiz not found",
          code: "QUIZ_NOT_FOUND",
        });
      }

      res.json({
        message: "Quiz retrieved successfully",
        code: "QUIZ_RETRIEVAL_SUCCESS",
        data: quiz,
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

      const query = db("quizzes");

      if (grade) query.where({ grade });
      if (subject) query.where({ subject });

      const quizzes = await query.orderBy("created_at", "desc");

      res.json({
        message: "Quizzes retrieved successfully",
        code: "QUIZZES_RETRIEVAL_SUCCESS",
        data: quizzes,
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

      const quizzes = await db("quizzes")
        .where({ created_by: userId })
        .orderBy("created_at", "desc");

      res.json({
        message: "User quizzes retrieved successfully",
        code: "USER_QUIZZES_RETRIEVAL_SUCCESS",
        data: quizzes,
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
