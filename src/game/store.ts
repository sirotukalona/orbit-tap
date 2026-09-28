/**
 * Module-level in-memory profile. Deliberately not AsyncStorage: that would
 * add a native dependency outside the allow-list for a value that only needs
 * to survive screen transitions inside one session.
 */
let bestScore = 0;
let runs = 0;

export const profile = {
  best: (): number => bestScore,
  runs: (): number => runs,
  commit(score: number): number {
    runs += 1;
    if (score > bestScore) {
      bestScore = score;
    }
    return bestScore;
  },
};
