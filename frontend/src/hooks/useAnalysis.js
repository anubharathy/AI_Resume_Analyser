import { useCallback, useEffect, useRef, useState } from "react";
import { ANALYSIS_STEPS, isValidPdf, mockAnalyze } from "../lib/analyzer.js";

const STEP_DURATION = 550; // ms per fake analysis step
const FINAL_DELAY = 350; // pause between "Scoring resume…" and the results

// A small state machine for the whole upload → analyze → results flow:
//   idle → analyzing → done   (valid PDF)
//   idle → error              (not a PDF)
// All state and timing live here so the components stay presentational.
export function useAnalysis() {
  const [status, setStatus] = useState("idle"); // "idle" | "analyzing" | "done" | "error"
  const [error, setError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Cancel any in-flight fake steps if the component unmounts.
  useEffect(() => clearTimers, []);

  const start = useCallback((file) => {
    if (!isValidPdf(file)) {
      setError(`"${file.name}" isn't a PDF. Please upload a PDF resume.`);
      setStatus("error");
      return;
    }

    clearTimers();
    setError("");
    setStepIndex(0);
    setResult(null);
    setStatus("analyzing");

    // Step 1 shows immediately; steps 2..n are scheduled.
    ANALYSIS_STEPS.forEach((_, i) => {
      if (i > 0) timers.current.push(setTimeout(() => setStepIndex(i), i * STEP_DURATION));
    });
    timers.current.push(
      setTimeout(() => {
        setResult(mockAnalyze(file));
        setStatus("done");
      }, ANALYSIS_STEPS.length * STEP_DURATION + FINAL_DELAY)
    );
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setError("");
    setStepIndex(0);
    setResult(null);
  }, []);

  return { status, error, stepIndex, result, start, reset };
}
