import Redis from "ioredis";

function createRedisConnection() {
  const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  });

  redis.on("error", (error) => {
    console.error("Redis error:", error);
  });

  return redis;
}

export const redis = createRedisConnection()

export const publisher = createRedisConnection();

export const subscriber = createRedisConnection();
