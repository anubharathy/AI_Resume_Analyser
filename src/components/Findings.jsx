import Score from "./Score.jsx";

function SkillList({ skills, kind }) {
  return (
    <ul className={`skills skills-${kind}`}>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}

// The graded sheet: score circled in red pen, then what was found and what
// wasn't, marked the way a reader marks a document.
export default function Findings({ result, onReset }) {
  return (
    <div className="findings">
      <div className="findings-head">
        <h2>Screening findings</h2>
        <p className="findings-file">{result.fileName}</p>
      </div>

      <div className="findings-grid">
        <div className="findings-score">
          <Score score={result.score} />
        </div>

        <div className="findings-skills">
          <div className="skills-block">
            <h3>Skills found ({result.present.length})</h3>
            <SkillList skills={result.present} kind="found" />
          </div>
          <div className="skills-block">
            <h3>Skills missing ({result.missing.length})</h3>
            <SkillList skills={result.missing} kind="missing" />
          </div>
        </div>
      </div>

      <p className="findings-note">
        Simulated analysis — the same file always gets the same marks. Nothing
        leaves your browser.
      </p>

      <button className="btn" onClick={onReset}>
        Grade another resume
      </button>
    </div>
  );
}
