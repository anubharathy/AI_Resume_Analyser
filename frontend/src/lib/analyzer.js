// The "analyzer" is still a mock: no backend, no real PDF parsing. The same
// file always produces the same result, because a tiny seeded PRNG is fed a
// hash of the file's name and size. Kept as a plain module so it stays
// testable and reusable — no React knowledge needed to understand it.

export const SKILL_POOL = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "Git", "Docker", "AWS", "REST APIs", "MongoDB", "HTML & CSS",
  "Testing", "CI/CD", "Linux", "Redis", "GraphQL", "Kubernetes",
];

export const ANALYSIS_STEPS = [
  "Reading PDF…",
  "Extracting text…",
  "Matching skills…",
  "Scoring resume…",
];

export function isValidPdf(file) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

// A tiny seeded PRNG (mulberry32) — same seed, same sequence of numbers.
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

// The mock "analysis": the file's name and size pick a pseudo-random but
// stable subset of skills, and the score is the exact share of checked skills
// the file shows — so the number can never contradict the lists below it.
export function mockAnalyze(file) {
  const rng = mulberry32(hashFile(file));

  // Shuffle a copy of the pool so found and missing skills never overlap.
  const shuffled = [...SKILL_POOL].sort(() => rng() - 0.5);

  const foundCount = 6 + Math.floor(rng() * 10); // 6–15 of the 18 skills
  const present = shuffled.slice(0, foundCount);
  const missing = shuffled.slice(foundCount);

  // The score IS the coverage: 9 of 18 skills found → 50/100.
  const score = Math.round((foundCount / SKILL_POOL.length) * 100);

  return { fileName: file.name, score, present, missing };
}
