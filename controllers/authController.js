const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../services/db");
const axios = require("axios");
require("dotenv").config();

const formatPhoneNumber = (phone) => {
  let formattedPhone = phone.trim();

  if (formattedPhone.startsWith("08")) {
    formattedPhone = "62" + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith("+62")) {
    formattedPhone = "62" + formattedPhone.substring(3);
  }

  return formattedPhone;
};

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, full_name, phone } = req.body;

  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Check if email or phone exists
    const existingUser = await db("users")
      .where({ email })
      .orWhere({ phone: formattedPhone })
      .first();

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already in use",
        code: "DUPLICATE_ENTRY",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Insert new user
    const [userId] = await db("users").insert({
      username,
      email,
      password: hashedPassword,
      full_name,
      phone: formattedPhone,
      verification_token: verificationToken,
    });

    try {
      const verificationLink = `${process.env.FE_URL}/verify?token=${verificationToken}`;
      const response = await axios.post("https://api.dripsender.id/send", {
        api_key: process.env.DRIPSENDER_API_KEY,
        phone: formattedPhone,
        text: `Hello, please verify your account using the following link: ${verificationLink}`,
      });

      if (response.data.ok) {
        res.status(201).json({
          message: "User registered successfully. Verification link sent!",
        });
      } else {
        await db("users").where({ email }).del();
        res.status(500).json({
          error: "Failed to send verification SMS",
          details: response.data.message,
          code: "SMS_ERROR",
        });
      }
    } catch (error) {
      await db("users").where({ email }).del();
      res.status(500).json({
        error: "Failed to send verification SMS",
        details: error.message,
        code: "SMS_ERROR",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Login successfully",
      code: "LOGIN_SUCCESS",
      user: {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  signup,
  login,
};
