import { useEffect, useState } from "react";

const COUNTUP_MS = 900;

// The one memorable element: the score, hand-circled in red pen like a
// grader's mark on paper. The ellipse draws itself once via stroke-dashoffset;
// the number counts up alongside it. Respects prefers-reduced-motion via CSS.
export default function Score({ score }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNTUP_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="score">
      <svg viewBox="0 0 260 170" role="img" aria-label={`Score ${score} out of 100`}>
        <path className="pen pen-back" d="M130 25 C 205 23, 245 55, 243 90 C 241 130, 195 152, 124 150 C 58 148, 16 122, 18 85 C 20 48, 65 27, 140 27" />
        <path className="pen pen-front" d="M131 39 C 193 37, 226 62, 224 89 C 222 121, 184 137, 125 135 C 71 133, 36 113, 38 84 C 40 55, 78 40, 143 41" />
      </svg>
      <div className="score-read">
        <span className="score-num">{shown}</span>
        <span className="score-of">out of 100</span>
      </div>
    </div>
  );
}
