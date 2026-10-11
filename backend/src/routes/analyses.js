import { Router } from "express";
import { Analysis } from "../models/Analysis.js";

// Routes for screening runs. POST stores a finished analysis; GET lists the
// recent ones so the UI can show a history later.
const router = Router();

router.post("/", async (req, res) => {
  const { fileName, score, present, missing } = req.body || {};

  if (!fileName || typeof score !== "number") {
    return res.status(400).json({ error: "fileName and numeric score are required" });
  }

  const doc = await Analysis.create({ fileName, score, present, missing });
  return res.status(201).json(doc);
});

router.get("/", async (req, res) => {
  const docs = await Analysis.find().sort({ createdAt: -1 }).limit(10);
  return res.json(docs);
});

export default router;
