/** Pure orbital maths — no React, no side effects. */

export const norm360 = (deg: number): number => ((deg % 360) + 360) % 360;

export interface Point {
  x: number;
  y: number;
}

export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
}

/** SVG arc path starting at `startDeg`, sweeping `sweepDeg` (may be negative). */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  sweepDeg: number,
): string {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, startDeg + sweepDeg);
  const large = Math.abs(sweepDeg) > 180 ? 1 : 0;
  const clockwise = sweepDeg >= 0 ? 1 : 0;
  return (
    'M ' +
    s.x.toFixed(2) +
    ' ' +
    s.y.toFixed(2) +
    ' A ' +
    r +
    ' ' +
    r +
    ' 0 ' +
    large +
    ' ' +
    clockwise +
    ' ' +
    e.x.toFixed(2) +
    ' ' +
    e.y.toFixed(2)
  );
}

/** Marker angle after `elapsedMs` of travel. 0deg === 3 o'clock, -90 === top. */
export function angleAt(
  startDeg: number,
  dir: number,
  periodMs: number,
  elapsedMs: number,
): number {
  return startDeg + dir * 360 * (elapsedMs / periodMs);
}

/** How far the marker has travelled INTO the arc, measured along `dir`. */
export function arcOffset(angle: number, arcStart: number, dir: number): number {
  return norm360(dir * (angle - arcStart));
}

export function isInArc(
  angle: number,
  arcStart: number,
  arcDeg: number,
  dir: number,
): boolean {
  return arcOffset(angle, arcStart, dir) <= arcDeg;
}
