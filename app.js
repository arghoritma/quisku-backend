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
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>QuisKU - Aplikasi Edukasi Inovatif</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f0f2f5;
          }
          .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
              color: #1a73e8;
              text-align: center;
              margin-bottom: 20px;
          }
          p {
              color: #333;
              text-align: justify;
          }
          .emoji {
              font-size: 24px;
              text-align: center;
              margin: 20px 0;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Selamat Datang di QuisKU</h1>
          <div class="emoji">📚 ✨</div>
          <p>
              QuisKU adalah aplikasi edukasi inovatif yang menghadirkan kuis interaktif untuk siswa dari tingkat SD hingga perguruan tinggi, termasuk mata pelajaran pesantren. Dengan fitur pembuatan kuis yang didukung oleh teknologi AI, pengguna dapat memilih kategori dan tingkat kesulitan kuis sesuai kebutuhan.
          </p>
          <p>
              Setiap kuis terdiri dari 10 pertanyaan pilihan ganda, dan pengguna mendapatkan skor serta XP berdasarkan jumlah jawaban benar. Aplikasi ini juga dilengkapi dengan leaderboard global dan kategori untuk mendorong semangat belajar melalui persaingan sehat.
          </p>
          <p>
              QuisKU adalah teman belajar yang menyenangkan dan efektif untuk meningkatkan pengetahuan dan keterampilan akademis.
          </p>
          <div class="emoji">😊</div>
      </div>
  </body>
  </html>
`);
});
app.use(errorHandler);

module.exports = app;
