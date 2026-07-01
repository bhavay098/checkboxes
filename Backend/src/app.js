import express from "express";
import cors from "cors";

import { getCheckboxState } from "./memory.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.get("/health", (req, res) => res.json({ healthy: true }));

app.get("/checkboxes", async (req, res) => {
  try {
    const checkboxes = await getCheckboxState();
    res.json({ checkboxes });
  } catch (error) {
    console.error("Failed to load checkbox state:", error);
    res.status(500).json({ error: "Failed to load checkbox state" });
  }
});

export default app;
