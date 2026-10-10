// Mock resume analyzer — no backend. Everything below simulates the analysis
// client-side so the landing page feels real: drop a PDF, watch it "parse",
// then see a score plus present/missing skills derived deterministically
// from the file (same file → same result).

const SKILL_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "Docker", "AWS", "REST APIs", "MongoDB", "HTML & CSS",
  "Testing", "CI/CD", "Linux", "Redis", "GraphQL", "Kubernetes",
];

const ANALYSIS_STEPS = [
  "Reading PDF…",
  "Extracting text…",
  "Matching skills…",
  "Scoring resume…",
];

const STEP_DURATION = 550; // ms per fake analysis step

const els = {
  dropzone: document.getElementById("dropzone"),
  fileInput: document.getElementById("file-input"),
  uploadError: document.getElementById("upload-error"),
  progress: document.getElementById("progress"),
  progressBar: document.getElementById("progress-bar"),
  progressStep: document.getElementById("progress-step"),
  results: document.getElementById("results"),
  resultsFile: document.getElementById("results-file"),
  scoreValue: document.getElementById("score-value"),
  ringFg: document.getElementById("ring-fg"),
  skillsPresent: document.getElementById("skills-present"),
  skillsMissing: document.getElementById("skills-missing"),
  resetBtn: document.getElementById("reset-btn"),
};

const RING_CIRCUMFERENCE = 2 * Math.PI * 52;
els.ringFg.style.strokeDasharray = RING_CIRCUMFERENCE;
els.ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE;

// ---------- Upload wiring ----------

els.dropzone.addEventListener("click", () => els.fileInput.click());

els.dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    els.fileInput.click();
  }
});

els.fileInput.addEventListener("change", () => {
  if (els.fileInput.files[0]) handleFile(els.fileInput.files[0]);
});

["dragenter", "dragover"].forEach((event) =>
  els.dropzone.addEventListener(event, (e) => {
    e.preventDefault();
    els.dropzone.classList.add("dragover");
  })
);

["dragleave", "drop"].forEach((event) =>
  els.dropzone.addEventListener(event, (e) => {
    e.preventDefault();
    els.dropzone.classList.remove("dragover");
  })
);

els.dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

els.resetBtn.addEventListener("click", reset);

// ---------- Analysis flow ----------

function handleFile(file) {
  hideError();

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    showError(`"${file.name}" isn't a PDF. Please upload a PDF resume.`);
    return;
  }

  runAnalysis(file);
}

function runAnalysis(file) {
  els.dropzone.hidden = true;
  els.results.hidden = true;
  els.progress.hidden = false;

  let i = 0;
  els.progressStep.textContent = ANALYSIS_STEPS[0];
  els.progressBar.style.width = "0%";

  const tick = () => {
    i += 1;
    els.progressStep.textContent = ANALYSIS_STEPS[i] ?? ANALYSIS_STEPS.at(-1);
    els.progressBar.style.width = `${(i / ANALYSIS_STEPS.length) * 100}%`;

    if (i < ANALYSIS_STEPS.length) {
      setTimeout(tick, STEP_DURATION);
    } else {
      setTimeout(() => showResults(file), 350);
    }
  };

  setTimeout(tick, STEP_DURATION);
}

function showResults(file) {
  els.progress.hidden = true;

  const result = mockAnalyze(file);

  els.resultsFile.textContent = file.name;
  renderScore(result.score);
  renderSkills(els.skillsPresent, result.present, "present");
  renderSkills(els.skillsMissing, result.missing, "missing");

  els.results.hidden = false;
  els.results.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function reset() {
  els.results.hidden = true;
  els.progress.hidden = true;
  els.dropzone.hidden = false;
  els.fileInput.value = "";
  els.scoreValue.textContent = "0";
  els.ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE;
  els.skillsPresent.replaceChildren();
  els.skillsMissing.replaceChildren();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Mock result generation ----------

// A tiny seeded PRNG so the same file always produces the same mock score.
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashFile(file) {
  const key = `${file.name}:${file.size}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function mockAnalyze(file) {
  const rng = mulberry32(hashFile(file));
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  // Shuffle a copy of the pool so present/missing skills never overlap.
  const shuffled = [...SKILL_POOL].sort(() => rng() - 0.5);

  const presentCount = 6 + Math.floor(rng() * 5); // 6–10 skills
  const missingCount = 3 + Math.floor(rng() * 3); // 3–5 skills

  const present = shuffled.slice(0, presentCount);
  const missing = shuffled.slice(presentCount, presentCount + missingCount);

  // Score loosely follows how many skills were found, with some noise.
  const score = Math.min(
    96,
    Math.max(45, Math.round(40 + presentCount * 5 + rng() * 10))
  );

  return { score, present, missing };
}

// ---------- Rendering ----------

function renderScore(score) {
  els.scoreValue.textContent = score;

  // Restart the count-up on each analysis.
  els.scoreValue.textContent = "0";
  const start = performance.now();
  const duration = 900;

  const countUp = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    els.scoreValue.textContent = Math.round(eased * score);
    if (t < 1) requestAnimationFrame(countUp);
  };
  requestAnimationFrame(countUp);

  // Animate the ring: dashoffset goes from full circumference (empty) to 0 (full).
  els.ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE; // reset
  requestAnimationFrame(() => {
    els.ringFg.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - score / 100);
  });
}

function renderSkills(listEl, skills, kind) {
  listEl.replaceChildren(
    ...skills.map((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      li.dataset.kind = kind;
      return li;
    })
  );
}

// ---------- Errors ----------

function showError(message) {
  els.uploadError.textContent = message;
  els.uploadError.hidden = false;
}

function hideError() {
  els.uploadError.hidden = true;
}
