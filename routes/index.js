const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const { admin, auth } = require("../configs/firebaseAdminConfig");
const db = require("../services/db");

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);

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

router.get("/test-auth", authMiddleware, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: req.user,
    uid: req.uid,
  });
});
module.exports = router;

/** /get-custom-token 
 * {
	"message": "Custom token generated successfully",
	"token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczNTA2ODE4NCwiZXhwIjoxNzM1MDcxNzg0LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1xbmM3Z0Bhcmdob3JpdG1hLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstcW5jN2dAYXJnaG9yaXRtYS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Inc5UHluYnVmZmpldnlxZHU1UkdUYXE2OEV6ZjIifQ.dAkKbblb8akYY_FqXL6KIBImBnrCSkxqn5ptV5yKTFu_pzxyVea4AybgJ0z3ZOFUYdjWPpHr2yF3IoFtVRJG1X9wEnL67M3T80TFqrG3LxOwA6WGLu1bM54px_b5OaFaeU3L00XK2NEuKSU-2JlAgKkVTNl2l799TJTfIAJs4ejjR1oGcqhTwYSiTLmHMRemaeJubdVFgx7lMI3HDngNIanSimoLGEaXyr_uiypDhR4Td1xh9lsgxyELm6wFR1gKqejC_Kk5HN-_1ezGqvRkdo-mlgQF7gCRkE8d7YhhElPNYb0Vgqgc2RYG8RyjxBaQJBz0lx23RSAjKtyih0teFw",
	"user": {
		"uid": "w9Pynbuffjevyqdu5RGTaq68Ezf2",
		"email": "gaga@gmail.com",
		"emailVerified": false,
		"disabled": false,
		"metadata": {
			"lastSignInTime": null,
			"creationTime": "Tue, 24 Dec 2024 19:09:09 GMT",
			"lastRefreshTime": null
		},
		"tokensValidAfterTime": "Tue, 24 Dec 2024 19:09:09 GMT",
		"providerData": [
			{
				"uid": "gaga@gmail.com",
				"email": "gaga@gmail.com",
				"providerId": "password"
			}
		]
	}
}
 */
