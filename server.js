const app = require("./app");
require("dotenv").config();
const { initializeDatabase } = require("./utils/initilaDatabase");
const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
