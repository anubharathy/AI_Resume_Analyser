import { useEffect, useRef } from "react";
import Dropzone from "./Dropzone.jsx";
import Parse from "./Parse.jsx";
import Findings from "./Findings.jsx";

// Chooses which state the sheet shows. The sheet is the same document in all
// three states: empty (dropzone), being read (parse), or graded (findings).
export default function UploadCard({ analysis }) {
  const { status, error, stepIndex, result, start, reset } = analysis;
  const findingsRef = useRef(null);

  const done = status === "done" && result;

  useEffect(() => {
    if (done) findingsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [done]);

  return (
    <div className="sheet" id="analyzer">
      {status === "idle" && <Dropzone onFile={start} />}

      {status === "error" && (
        <div className="sheet-error">
          <p className="error-text">{error}</p>
          <button className="btn" onClick={reset}>
            Try a PDF
          </button>
        </div>
      )}

      {status === "analyzing" && <Parse stepIndex={stepIndex} />}

      {done && (
        <div ref={findingsRef}>
          <Findings result={result} onReset={reset} />
        </div>
      )}
    </div>
  );
}
