const { validationResult } = require("express-validator");
const { turso } = require("../configs/tursoDatabase");
require("dotenv").config();
const { formatPhoneNumber } = require("../utils/helpers");
const { auth } = require("../configs/firebaseAdminConfig");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, full_name, phone } = req.body;

  try {
    const formattedPhone = formatPhoneNumber(phone);

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        code: "PASSWORD_TOO_SHORT",
      });
    }

    // Check if email or phone exists
    const existingUser = await turso.execute({
      sql: "SELECT * FROM users WHERE email = ? OR phone = ?",
      args: [email, formattedPhone],
    });

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email or phone number already in use",
        code: "DUPLICATE_ENTRY",
      });
    }

    let createdFirebaseUser = null;

    try {
      // Create user in Firebase
      createdFirebaseUser = await auth.createUser({
        email,
        password,
        displayName: full_name,
        phoneNumber: formattedPhone.startsWith("+")
          ? formattedPhone
          : "+" + formattedPhone,
      });

      // Insert new user to database
      const userId = createdFirebaseUser.uid || uuidv4();
      await turso.execute({
        sql: "INSERT INTO users (user_id, username, email, password, full_name, phone) VALUES (?, ?, ?, ?, ?, ?)",
        args: [userId, username, email, password, full_name, formattedPhone],
      });

      res.status(201).json({
        message: "User registered successfully",
        code: "REGISTRATION_SUCCESS",
        uid: userId,
      });
    } catch (innerError) {
      // If database insertion fails, delete Firebase user
      if (createdFirebaseUser) {
        try {
          await auth.deleteUser(createdFirebaseUser.uid);
        } catch (deleteError) {
          console.error("Error deleting Firebase user:", deleteError);
        }
      }

      // If there's a database record, delete it
      try {
        if (createdFirebaseUser) {
          await turso.execute({
            sql: "DELETE FROM users WHERE user_id = ?",
            args: [createdFirebaseUser.uid],
          });
        }
      } catch (dbDeleteError) {
        console.error("Error deleting database record:", dbDeleteError);
      }

      throw innerError;
    }
  } catch (err) {
    const errorCode = err.code || "UNKNOWN_ERROR";
    const errorMessage = err.message || "An unknown error occurred";

    res.status(500).json({
      message: errorMessage,
      code: errorCode,
    });
  }
};

module.exports = {
  signup,
};
