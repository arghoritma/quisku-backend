const app = require("./app");
require("dotenv").config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const initializeDatabase = require("./models/initializeDatabase");
//initializeDatabase();
app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
