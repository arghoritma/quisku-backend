const express = require("express");
const router = express.Router();
const participantsRoutes = require("./participantsRoutes");
const usersRoutes = require("./usersRoutes");
const eventsRoutes = require("./eventsRoutes");
const reservationsRoutes = require("./reservationsRoutes");
const paymentsRoutes = require("./paymentsRoutes");
const sessionsRoutes = require("./sessionsRoutes");
const validatorsRoutes = require("./validatorsRoutes");
const scannedRoutes = require("./scannedRoutes");
const authRoutes = require("./authRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const auth = require("../middlewares/authMiddleware");

router.use("/participants", participantsRoutes);
router.use("/users", authMiddleware, usersRoutes);
router.use("/events", authMiddleware, eventsRoutes);
router.use("/reservations", reservationsRoutes);
router.use("/payments", authMiddleware, paymentsRoutes);
router.use("/sessions", authMiddleware, sessionsRoutes);
router.use("/validators", validatorsRoutes);
router.use("/scanned", scannedRoutes);
router.use("/auth", authRoutes);

router.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
