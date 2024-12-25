const { validationResult } = require("express-validator");
const db = require("../services/db");
require("dotenv").config();
const { formatPhoneNumber } = require("../utils/helpers");
const { auth } = require("../configs/firebaseAdminConfig");

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

    let createdFirebaseUser = null;

    try {
      // Create user in Firebase
      createdFirebaseUser = await auth.createUser({
        email,
        password,
        displayName: full_name,
        phoneNumber: "+" + formattedPhone,
      });

      // Insert new user to database
      await db("users").insert({
        user_id: createdFirebaseUser.uid,
        username,
        email,
        password: password,
        full_name,
        phone: formattedPhone,
      });

      res.status(201).json({
        message: "User registered successfully",
        code: "REGISTRATION_SUCCESS",
        uid: createdFirebaseUser.uid,
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
          await db("users")
            .where({ user_id: createdFirebaseUser.uid })
            .delete();
        }
      } catch (dbDeleteError) {
        console.error("Error deleting database record:", dbDeleteError);
      }

      throw innerError;
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      code: "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  signup,
};
