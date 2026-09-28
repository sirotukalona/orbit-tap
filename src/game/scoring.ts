export type HitQuality = 'perfect' | 'good';

/** Perfect = marker struck the middle third of the lit arc. */
export function hitQuality(offsetDeg: number, arcDeg: number): HitQuality {
  const third = arcDeg / 3;
  return offsetDeg > third && offsetDeg < third * 2 ? 'perfect' : 'good';
}

export function hitPoints(combo: number, quality: HitQuality): number {
  const base = 10 + combo * 2;
  return quality === 'perfect' ? base * 2 : base;
}

export type Outcome = 'failed' | 'complete' | 'timeout';

export interface SessionResult {
  outcome: Outcome;
  score: number;
  bestCombo: number;
  round: number;
}
