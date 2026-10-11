import { ANALYSIS_STEPS } from "../lib/analyzer.js";

// The sheet while it's being read: a typewriter step line and a thin rule
// that draws across the page, like a line being ruled onto paper.
export default function Parse({ stepIndex }) {
  const step = ANALYSIS_STEPS[stepIndex] ?? ANALYSIS_STEPS.at(-1);

  return (
    <div className="parse" aria-live="polite">
      <p className="parse-step">{step}</p>
      <div className="parse-track">
        <div
          className="parse-line"
          style={{ width: `${((stepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
