const { auth } = require("../configs/firebaseAdminConfig");

const authMiddleware = async (req, res, next) => {
  const uid = req.header("X-User-UID");

  if (!uid) {
    const error = new Error("No UID header found");
    error.code = "NO_UID_HEADER";
    return next(error);
  }

  try {
    const userRecord = await auth.getUser(uid);
    req.user = userRecord;
    req.uid = uid;
    next();
  } catch (err) {
    const error = new Error("Invalid UID");
    error.code = "INVALID_UID";
    return next(error);
  }
};

module.exports = authMiddleware;
