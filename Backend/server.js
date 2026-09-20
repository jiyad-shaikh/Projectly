require("dotenv").config();

const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = require("./src/app");
const connectDB = require("./src/config/database");

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});