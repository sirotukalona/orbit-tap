import {Dimensions} from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/* ---------- loader ---------- */
export const LOADER_DURATION_MS = 8000;
export const LOADER_TICK_MS = 200;
export const LOADER_GRAIN_COUNT = 1500;

/* ---------- chrome ---------- */
export const HEADER_H = 116; // 44 status-bar inset + 72 bar

/* ---------- arena geometry (CLAUDE.md #4/#5 — overflow <= 2px) ---------- */
export const ARENA_MAX = Math.min(SCREEN_W - 32, 380);
export const ARENA_PAD = 10;
export const ARENA_BORDER = 2;
export const ARENA_FRAME = ARENA_PAD + ARENA_BORDER; // 12
export const ARENA_INNER = ARENA_MAX - 2 * ARENA_FRAME;
export const MARKER_R = 14;
export const ORBIT_R = Math.floor(ARENA_INNER / 2) - MARKER_R - 2;
export const ARENA_W = ARENA_INNER + 2 * ARENA_FRAME; // === ARENA_MAX
export const PLANET_D = Math.max(64, Math.min(92, (ORBIT_R - MARKER_R - 10) * 2));

export const DOCK_H = 96;
export const DOCK_BOTTOM = 28;
export const DOCK_RESERVE = DOCK_BOTTOM + DOCK_H + 16;

/* ---------- session rules ---------- */
export const MISS_LIMIT = 3;
export const ROUND_BEATS = 6;
export const BEAT_LEAD_DEG = 40;
export const MISS_GRACE_MS = 140;
export const SPIN_TURNS = 40;
export const HINT_MS = 3200;

/**
 * Capture-window budget (CLAUDE.md #11/#13, and the "idle backstop must exceed
 * the nav agent's ~22s first-shot latency" incident). A passive test runner
 * taps nothing, so its three misses land at roughly 8.5s / 19s / 29.5s — the
 * arena is on screen well before the first gameplay screenshot (~22s) and the
 * result screen surfaces after it. Do NOT lower FIRST_BEAT_DELAY_MS or
 * SESSION_WARMUP_GAP_MS: it collapses the capture window.
 */
export const FIRST_BEAT_DELAY_MS = 7000;
export const SESSION_WARMUP_GAP_MS = 9000;
export const SESSION_WARMUP_BEATS = 3;
export const ROUND_TIMEOUT_MS = 42000;

export interface RoundSpec {
  periodMs: number;
  dir: 1 | -1;
  arcDeg: number;
  beatGapMs: number;
}

export const ROUNDS: RoundSpec[] = [
  {periodMs: 3600, dir: 1, arcDeg: 96, beatGapMs: 9000},
  {periodMs: 3000, dir: -1, arcDeg: 78, beatGapMs: 5200},
  {periodMs: 2500, dir: 1, arcDeg: 62, beatGapMs: 3800},
  {periodMs: 2100, dir: -1, arcDeg: 48, beatGapMs: 2800},
  {periodMs: 1750, dir: 1, arcDeg: 38, beatGapMs: 2100},
];

export interface Mission {
  id: string;
  name: string;
  startRound: number;
  blurb: string;
}

export const MISSIONS: Mission[] = [
  {id: 'calm', name: 'CALM ORBIT', startRound: 0, blurb: 'WIDE ARC · SLOW PULSE'},
  {id: 'twin', name: 'TWIN MOONS', startRound: 1, blurb: 'TIGHTER ARC · REVERSED'},
  {id: 'reverse', name: 'REVERSE PULSE', startRound: 2, blurb: 'FAST BEAT · NARROW ARC'},
];
