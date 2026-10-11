import mongoose from "mongoose";

// The record created for every screening run. fileName, score, present and
// missing match the shape the frontend already renders.
const analysisSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    present: { type: [String], default: [] },
    missing: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Analysis = mongoose.model("Analysis", analysisSchema);
