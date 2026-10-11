import express from "express";
import cors from "cors";
import { connectDB } from "./src/db.js";
import analysesRouter from "./src/routes/analyses.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/analyses", analysesRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
