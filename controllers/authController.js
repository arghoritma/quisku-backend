const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../models/db"); // Assumsi db.js digunakan untuk query
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

// Sign Up without verified
// const signup = (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { username, email, password, full_name } = req.body;

//   try {
//     db.execute(`SELECT * FROM users WHERE email = ?`, [email], (err, rows) => {
//       if (err) {
//         return res.status(500).json({
//           error: err.message,
//           code: "DATABASE_ERROR",
//         });
//       }

//       if (rows.length > 0) {
//         return res.status(400).json({
//           message: "Email already in use",
//           code: "EMAIL_IN_USE",
//         });
//       }

//       bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//           return res.status(500).json({
//             error: err.message,
//             code: "HASHING_ERROR",
//           });
//         }

//         db.execute(
//           `INSERT INTO users (username, email, password, full_name, phone) VALUES (?, ?, ?, ?)`,
//           [username, email, hashedPassword, full_name],
//           (err, result) => {
//             if (err) {
//               return res.status(500).json({
//                 error: err.message,
//                 code: "DATABASE_ERROR",
//               });
//             }

//             res.status(201).json({ message: "User registered successfully" });
//           }
//         );
//       });
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//       code: "UNKNOWN_ERROR",
//     });
//   }
// };

// Sign Up with verified

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, full_name, phone } = req.body;

  try {
    // Format ulang nomor telepon
    const formattedPhone = formatPhoneNumber(phone);

    // Cek apakah email atau nomor telepon sudah digunakan
    db.execute(
      `SELECT * FROM users WHERE email = ? OR phone = ?`,
      [email, formattedPhone],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
            code: "DATABASE_ERROR",
          });
        }

        if (rows.length > 0) {
          return res.status(400).json({
            message: "Email or phone number already in use",
            code: "DUPLICATE_ENTRY",
          });
        }

        // Hash password sebelum disimpan
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({
              error: err.message,
              code: "HASHING_ERROR",
            });
          }

          // Generate verification token
          const verificationToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h", // Token expires in 1 hour
            }
          );

          // Simpan user ke database
          db.execute(
            `INSERT INTO users (username, email, password, full_name, phone, verification_token) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              username,
              email,
              hashedPassword,
              full_name,
              formattedPhone,
              verificationToken,
            ],
            (err, result) => {
              if (err) {
                return res.status(500).json({
                  error: err.message,
                  code: "DATABASE_ERROR",
                });
              }

              // Kirim pesan verifikasi menggunakan DripSender API dengan Axios
              const verificationLink = `${process.env.FE_URL}/verify?token=${verificationToken}`;

              axios
                .post("https://api.dripsender.id/send", {
                  api_key: process.env.DRIPSENDER_API_KEY,
                  phone: formattedPhone,
                  text: `Hello, please verify your account using the following link: ${verificationLink}`,
                })
                .then((response) => {
                  if (response.data.ok) {
                    res.status(201).json({
                      message:
                        "User registered successfully. Verification link sent!",
                    });
                  } else {
                    res.status(500).json({
                      error: "Failed to send verification SMS",
                      details: response.data.message,
                      code: "SMS_ERROR",
                    });
                    // Hapus user dari database jika SMS gagal
                    db.execute(
                      `DELETE FROM users WHERE email = ?`,
                      [email],
                      (err) => {
                        if (err) {
                          console.error("Error deleting user:", err);
                        }
                      }
                    );
                  }
                })
                .catch((error) => {
                  res.status(500).json({
                    error: "Failed to send verification SMS",
                    details: error.message,
                    code: "SMS_ERROR",
                  });
                  // Hapus user dari database jika terjadi kesalahan
                  db.execute(
                    `DELETE FROM users WHERE email = ?`,
                    [email],
                    (err) => {
                      if (err) {
                        console.error("Error deleting user:", err);
                      }
                    }
                  );
                });
            }
          );
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
      code: "UNKNOWN_ERROR",
    });
  }
};
// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah user ada di database
    db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
            code: "DATABASE_ERROR",
          });
        }
        if (results.length === 0) {
          return res.status(404).json({
            message: "User not found",
            code: "USER_NOT_FOUND",
          });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err)
            return res.status(500).json({
              error: "Error during password comparison",
              code: "COMPARISON_ERROR",
            });
          if (!isMatch)
            return res.status(400).json({
              message: "Invalid credentials",
              code: "INVALID_CREDENTIALS",
            });

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
        });
      }
    );
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
