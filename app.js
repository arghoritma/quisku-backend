const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/index");
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", apiRoutes);
app.get("/", (req, res) => {
  res.send("<h1>DIGITIK</h1><p>Backend For Digitik</p>");
});
app.use(errorHandler);

module.exports = app;
