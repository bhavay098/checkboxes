import http from "node:http";

import "dotenv/config";
import { Server } from "socket.io";

import app from "./src/app.js";
import { initializeCheckboxState, updateCheckbox } from "./src/memory.js";
import { publisher, subscriber, redis } from "./src/redis-connection.js";

async function main() {
  const PORT = process.env.PORT ?? 8000;

  await initializeCheckboxState();

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  await subscriber.subscribe("internal-server:checkbox:change");

  subscriber.on("message", async (channel, message) => {
    if (channel === "internal-server:checkbox:change") {
      const { index, checked } = JSON.parse(message);

      await updateCheckbox(index, checked);
      io.emit("server:checkbox:change", { index, checked });
    }
  });

  const COOLDOWN_MS = 2000;

  // Socket IO Handler
  io.on("connection", (socket) => {
    console.log(`Socket connected`, { id: socket.id });

    socket.on("client:checkbox:change", async (data) => {
      console.log(`[Socket:${socket.id}:client:checkbox:change]`, data);

      const currentTime = Date.now();

      const lastOperationTime = Number(
        (await redis.get(`rate-limit:${socket.id}`)) ?? 0,
      );

      if (currentTime - lastOperationTime < COOLDOWN_MS) {
        socket.emit("server:rate-limit", {
          message: "Please wait 2 seconds before changing again.",
        });
        return;
      }

      await redis.set(
        `rate-limit:${socket.id}`,
        String(currentTime),
        "PX",
        COOLDOWN_MS,
      );

      await publisher.publish(
        "internal-server:checkbox:change",
        JSON.stringify(data),
      );
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected`, { id: socket.id });
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

main();
