const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const quizzRoutes = require("./quizzRoutes");
const scoreRoutes = require("./scoreRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const { auth } = require("../configs/firebaseAdminConfig");
const db = require("../services/db");
const { model } = require("../configs/geminiConfigs");

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);
router.use("/quizz", authMiddleware, quizzRoutes);
router.use("/scores", authMiddleware, scoreRoutes);
router.use("/leaderboard", authMiddleware, leaderboardRoutes);
router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/test-firebase", async (req, res) => {
  try {
    const listUsers = await auth.listUsers();
    res.json({
      message: "Firebase connection successful",
      users: listUsers.users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Firebase connection failed", message: error.message });
  }
});

router.post("/get-custom-token", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const userRecord = await auth.getUserByEmail(email);
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.json({
      message: "Custom token generated successfully",
      token: customToken,
      user: userRecord,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate custom token",
      message: error.message,
    });
  }
});

router.get("/test-database", async (req, res) => {
  try {
    await db.raw("SELECT 1");
    res.json({
      message: "Database connection successful",
      database: process.env.DB_NAME,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Database connection failed", message: error.message });
  }
});

router.get("/test-gemini", async (req, res) => {
  try {
    const prompt = "Assalamualaykum.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      message: "Gemini AI connection successful",
      response: text,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gemini AI connection failed", message: error.message });
  }
});

router.get("/test-auth", authMiddleware, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user,
    uid: req.uid,
  });
});
module.exports = router;
