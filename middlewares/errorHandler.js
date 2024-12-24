const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const errorCode = err.code || "UNKNOWN_ERROR";
  const errorMessage = err.message || "Something went wrong!";

  res.status(500).json({
    message: errorMessage,
    code: errorCode,
  });
};

module.exports = errorHandler;
