const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");
const { connectRedis } = require("./Config/redis");

mongoose.set("strictQuery", false);
const DB = process.env.DATABASE;

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. MongoDB
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully...");

    // 2. Redis
    await connectRedis();
    console.log("Redis connected successfully...");

    // 3. HTTP server
    app.listen(port, () => {
      console.log(`Server running on port: ${port}...`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();
