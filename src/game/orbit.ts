import {
  COMBO_CAP,
  COMBO_STEP,
  DIFFICULTIES,
  HIT_SCORE,
  PERFECT_SCORE,
  type DifficultyId,
} from '../constants/config';

export type TapKind = 'perfect' | 'hit' | 'miss';

export interface RoundConfig {
  round: number;
  beats: number;
  speedDegPerSec: number;
  arcWidthDeg: number;
}

/** Normalise any angle into [0, 360). */
export function normDeg(deg: number): number {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

/** Shortest signed distance from `a` to `b`, in (-180, 180]. */
export function angleDelta(a: number, b: number): number {
  let d = normDeg(b) - normDeg(a);
  if (d > 180) {
    d -= 360;
  }
  if (d <= -180) {
    d += 360;
  }
  return d;
}

/** Classify a tap by how far the planet sits from the arc centre. */
export function classifyTap(delta: number, arcWidthDeg: number): TapKind {
  const half = arcWidthDeg * 0.5;
  const abs = Math.abs(delta);
  if (abs <= half / 3) {
    return 'perfect';
  }
  if (abs <= half) {
    return 'hit';
  }
  return 'miss';
}

export function beatsForRound(round: number): number {
  if (round <= 1) {
    return 4;
  }
  if (round === 2) {
    return 5;
  }
  if (round === 3) {
    return 6;
  }
  if (round === 4) {
    return 7;
  }
  return 8;
}

export function roundConfig(round: number, difficulty: DifficultyId): RoundConfig {
  const diff = DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[1];
  const baseSpeed = Math.min(92 + 14 * (round - 1), 230);
  const baseArc = Math.max(46 - 2.5 * (round - 1), 26);
  return {
    round,
    beats: beatsForRound(round),
    speedDegPerSec: Math.round(baseSpeed * diff.speedMul),
    arcWidthDeg: Math.round(baseArc * diff.arcMul * 10) / 10,
  };
}

export function comboMultiplier(combo: number): number {
  const mul = 1 + Math.floor(combo / COMBO_STEP) * 0.25;
  return Math.min(mul, COMBO_CAP);
}

export function beatScore(kind: TapKind, combo: number): number {
  if (kind === 'miss') {
    return 0;
  }
  const base = kind === 'perfect' ? PERFECT_SCORE : HIT_SCORE;
  return Math.round(base * comboMultiplier(combo));
}

export function formatMultiplier(combo: number): string {
  return 'x' + comboMultiplier(combo).toFixed(2);
}

/** Cartesian point on a ring, 0deg = 12 o'clock, clockwise positive. */
export function polarToXY(
  cx: number,
  cy: number,
  radius: number,
  deg: number,
): {x: number; y: number} {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad)};
}

/** SVG arc path between two angles on a circle. */
export function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polarToXY(cx, cy, radius, endDeg);
  const end = polarToXY(cx, cy, radius, startDeg);
  const sweep = Math.abs(endDeg - startDeg);
  const largeArc = sweep > 180 ? '1' : '0';
  return [
    'M',
    start.x.toFixed(2),
    start.y.toFixed(2),
    'A',
    radius.toFixed(2),
    radius.toFixed(2),
    0,
    largeArc,
    0,
    end.x.toFixed(2),
    end.y.toFixed(2),
  ].join(' ');
}

