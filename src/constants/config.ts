import {Dimensions} from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/**
 * Loader timing. 8000ms is a capture-timing constant for the screen
 * transition, NOT an animation duration — the progress bar runs its own short
 * tween (LOADER_BAR_ANIM_MS) so the window reaches idle well before the swap.
 */
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_ANIM_MS = 1400;
export const LOADER_FADE_MS = 320;

/** Arena geometry. Parent padding + border are excluded from the inner box. */
export const ARENA = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 10;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 12
export const INNER = Math.floor(ARENA - 2 * BOARD_FRAME);
export const CENTER = INNER / 2;

export const RING_RADII: number[] = [
  Math.round(INNER * 0.22),
  Math.round(INNER * 0.32),
  Math.round(INNER * 0.42),
];
export const PLANET_SIZE = 22;
export const PLANET_GLOW = 4;

/** Safety nets required by the capture harness. */
export const IDLE_BACKSTOP_MS = 24000;
export const MIN_MS_FROM_MOUNT = 24000;
export const MAX_SESSION_MS = 46000;

/** Round rules. */
export const START_LIVES = 3;
export const LEAD_DEG = 150;
export const MISS_OVERSHOOT_DEG = 22;
export const DRIFT_DEG_PER_SEC = 18;
export const COUNTDOWN_MS = 900;
export const FEEDBACK_MS = 320;
export const ROUND_BANNER_MS = 520;

export type DifficultyId = 'CADET' | 'PILOT' | 'ACE';

export interface Difficulty {
  id: DifficultyId;
  speedMul: number;
  arcMul: number;
}

export const DIFFICULTIES: Difficulty[] = [
  {id: 'CADET', speedMul: 0.85, arcMul: 1.15},
  {id: 'PILOT', speedMul: 1.0, arcMul: 1.0},
  {id: 'ACE', speedMul: 1.2, arcMul: 0.85},
];

export const DEFAULT_DIFFICULTY: DifficultyId = 'PILOT';

export const HIT_SCORE = 100;
export const PERFECT_SCORE = 200;
export const ROUND_BONUS = 250;
export const COMBO_STEP = 5;
export const COMBO_CAP = 3.0;
