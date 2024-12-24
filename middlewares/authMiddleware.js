const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    const error = new Error("No Authorization header found");
    error.code = "NO_AUTH_HEADER";
    return next(error); // Pass error to error handler
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    const error = new Error("No token provided");
    error.code = "NO_TOKEN_PROVIDED";
    return next(error); // Pass error to error handler
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error("Invalid token");
    error.code = "INVALID_TOKEN";
    return next(error); // Pass error to error handler
  }
};

module.exports = auth;
