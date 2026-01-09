const redis = require("redis");

const redisUrl = process.env.REDIS_URL;

const client = redis.createClient({
  url: redisUrl,
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("connect", () => {
  console.log("Redis Client Connected");
});

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

module.exports = {
  client,
  connectRedis,
};
