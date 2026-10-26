/**
 * Session stats. Kept in module state (no native storage dependency) and
 * seeded at app start — persisted for the lifetime of the process.
 */
export interface CareerStats {
  bestScore: number;
  bestStreak: number;
  totalPerfects: number;
}

let career: CareerStats = {bestScore: 0, bestStreak: 0, totalPerfects: 0};

export function getStats(): CareerStats {
  return career;
}

export interface RunResult {
  score: number;
  round: number;
  perfects: number;
  bestStreak: number;
}

/** Fold a finished run into the career record. Returns true on a new best. */
export function commitRun(run: RunResult): boolean {
  const isBest = run.score > career.bestScore;
  career = {
    bestScore: Math.max(career.bestScore, run.score),
    bestStreak: Math.max(career.bestStreak, run.bestStreak),
    totalPerfects: career.totalPerfects + run.perfects,
  };
  return isBest;
}

export function resetStats(): void {
  career = {bestScore: 0, bestStreak: 0, totalPerfects: 0};
}
