import express from "express";
import cors from "cors";

import { getCheckboxState } from "./memory.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/health", (req, res) => res.json({ healthy: true }));

app.get("/checkboxes", async (req, res) => {
  const checkboxes = await getCheckboxState();
  res.json({ checkboxes });
});

export default app;
