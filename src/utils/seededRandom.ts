/** Deterministic PRNG (mulberry32) — seeded so decor never re-randomises. */
export function makeRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  c: string;
}

/** Seeded star field. `bright` adds the incompressible high-frequency grain. */
export function buildStars(
  count: number,
  w: number,
  h: number,
  seed: number,
  bright: boolean,
): Star[] {
  const rnd = makeRandom(seed);
  const palette = ['#F5F7FF', '#A8B2D8', '#5B8CFF', '#FF6B9A', '#7C4DFF', '#4DE8C2'];
  const out: Star[] = [];
  for (let i = 0; i < count; i++) {
    const isBright = bright && rnd() < 0.45;
    out.push({
      x: Math.round(rnd() * w),
      y: Math.round(rnd() * h),
      r: isBright ? 1.0 + rnd() * 2.4 : 0.6 + rnd() * 1.2,
      o: isBright ? 0.35 + rnd() * 0.55 : 0.18 + rnd() * 0.3,
      c: palette[Math.floor(rnd() * palette.length)],
    });
  }
  return out;
}
