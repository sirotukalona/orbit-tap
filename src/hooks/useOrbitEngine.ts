import {useCallback, useEffect, useRef, useState} from 'react';
import {
  COUNTDOWN_MS,
  DRIFT_DEG_PER_SEC,
  FEEDBACK_MS,
  IDLE_BACKSTOP_MS,
  LEAD_DEG,
  MAX_SESSION_MS,
  MIN_MS_FROM_MOUNT,
  MISS_OVERSHOOT_DEG,
  ROUND_BANNER_MS,
  ROUND_BONUS,
  START_LIVES,
  type DifficultyId,
} from '../constants/config';
import {
  angleDelta,
  beatScore,
  classifyTap,
  normDeg,
  roundConfig,
  type TapKind,
} from '../game/orbit';
import type {RunResult} from '../game/stats';

export type Phase =
  | 'ready'
  | 'countdown'
  | 'playing'
  | 'resolving'
  | 'roundclear'
  | 'over';
export type Feedback = 'none' | 'hit' | 'perfect' | 'miss';

export interface EngineView {
  phase: Phase;
  angles: number[];
  activeRing: number;
  arcCenterDeg: number;
  arcWidthDeg: number;
  score: number;
  combo: number;
  lives: number;
  round: number;
  beat: number;
  beats: number;
  speed: number;
  direction: number;
  feedback: Feedback;
  coreLabel: string;
  banner: string;
  tutorial: boolean;
}

const INITIAL_ANGLES = [24, 142, 268];

export function useOrbitEngine(
  difficulty: DifficultyId,
  onGameOver: (r: RunResult) => void,
  paused: boolean,
) {
  const first = roundConfig(1, difficulty);

  const [view, setView] = useState<EngineView>({
    phase: 'ready',
    angles: INITIAL_ANGLES,
    activeRing: 0,
    arcCenterDeg: 48,
    arcWidthDeg: first.arcWidthDeg,
    score: 0,
    combo: 0,
    lives: START_LIVES,
    round: 1,
    beat: 0,
    beats: first.beats,
    speed: first.speedDegPerSec,
    direction: 1,
    feedback: 'none',
    coreLabel: 'TAP TO LAUNCH',
    banner: '',
    tutorial: true,
  });

  const anglesRef = useRef<number[]>(INITIAL_ANGLES.slice());
  const dirRef = useRef(1);
  const speedRef = useRef(first.speedDegPerSec);
  const arcCenterRef = useRef(48);
  const arcWidthRef = useRef(first.arcWidthDeg);
  const sweptRef = useRef(0);
  const activeRef = useRef(0);
  const phaseRef = useRef<Phase>('ready');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const livesRef = useRef(START_LIVES);
  const roundRef = useRef(1);
  const beatRef = useRef(0);
  const beatsRef = useRef(first.beats);
  const perfectsRef = useRef(0);
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const finishedRef = useRef(false);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const publishedRef = useRef(0);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const mountedAtRef = useRef(Date.now());
  const pausedRef = useRef(paused);
  const difficultyRef = useRef(difficulty);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
  }, [onGameOver]);

  useEffect(() => {
    difficultyRef.current = difficulty;
  }, [difficulty]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  const publish = useCallback((patch: Partial<EngineView>) => {
    setView(prev => ({...prev, ...patch}));
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  /**
   * Commit the run. The result is held back until the board has been on
   * screen for MIN_MS_FROM_MOUNT, so the capture window always gets a
   * gameplay frame before the result frame.
   */
  const finish = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    phaseRef.current = 'over';
    stopLoop();
    publish({
      phase: 'over',
      coreLabel: 'MISSION ENDED',
      feedback: 'none',
      banner: '',
    });
    const elapsed = Date.now() - mountedAtRef.current;
    const wait = Math.max(600, MIN_MS_FROM_MOUNT - elapsed);
    later(() => {
      onGameOverRef.current({
        score: scoreRef.current,
        round: roundRef.current,
        perfects: perfectsRef.current,
        bestStreak: bestStreakRef.current,
      });
    }, wait);
  }, [later, publish, stopLoop]);

  const armBeat = useCallback(() => {
    const rc = roundConfig(roundRef.current, difficultyRef.current);
    const active = beatRef.current % 3;
    activeRef.current = active;
    beatsRef.current = rc.beats;

    if (roundRef.current > 1 && beatRef.current === 0) {
      dirRef.current = -dirRef.current;
    } else if (roundRef.current > 1 && Math.random() < 0.45) {
      dirRef.current = -dirRef.current;
    }

    const jitter = 0.88 + Math.random() * 0.24;
    speedRef.current = Math.round(rc.speedDegPerSec * jitter);
    arcWidthRef.current = rc.arcWidthDeg;
    arcCenterRef.current = Math.round(Math.random() * 360);
    sweptRef.current = 0;

    const next = anglesRef.current.slice();
    next[active] = normDeg(arcCenterRef.current - dirRef.current * LEAD_DEG);
    anglesRef.current = next;

    const firstBeat = roundRef.current === 1 && beatRef.current === 0;
    phaseRef.current = 'playing';
    publish({
      phase: 'playing',
      angles: next,
      activeRing: active,
      arcCenterDeg: arcCenterRef.current,
      arcWidthDeg: arcWidthRef.current,
      speed: speedRef.current,
      direction: dirRef.current,
      beat: beatRef.current,
      beats: rc.beats,
      round: roundRef.current,
      feedback: 'none',
      coreLabel: firstBeat ? 'TAP ON THE ARC' : 'TAP',
      banner: '',
      tutorial: firstBeat,
    });
  }, [publish]);

  const nextBeat = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    if (livesRef.current <= 0) {
      finish();
      return;
    }
    beatRef.current += 1;
    if (beatRef.current >= beatsRef.current) {
      scoreRef.current += ROUND_BONUS * roundRef.current;
      phaseRef.current = 'roundclear';
      publish({
        phase: 'roundclear',
        score: scoreRef.current,
        banner: 'ROUND ' + roundRef.current + ' CLEAR',
        coreLabel: 'READY',
        feedback: 'none',
      });
      later(() => {
        if (finishedRef.current) {
          return;
        }
        roundRef.current += 1;
        beatRef.current = 0;
        armBeat();
      }, ROUND_BANNER_MS);
      return;
    }
    armBeat();
  }, [armBeat, finish, later, publish]);

  const resolveBeat = useCallback(
    (kind: TapKind) => {
      phaseRef.current = 'resolving';
      stopLoop();
      if (kind === 'miss') {
        livesRef.current = Math.max(0, livesRef.current - 1);
        comboRef.current = 0;
        streakRef.current = 0;
      } else {
        scoreRef.current += beatScore(kind, comboRef.current);
        comboRef.current += 1;
        streakRef.current += 1;
        if (streakRef.current > bestStreakRef.current) {
          bestStreakRef.current = streakRef.current;
        }
        if (kind === 'perfect') {
          perfectsRef.current += 1;
        }
      }
      let label = 'MISS';
      if (kind === 'perfect') {
        label = 'PERFECT';
      } else if (kind === 'hit') {
        label = 'NICE';
      }
      publish({
        phase: 'resolving',
        feedback: kind,
        score: scoreRef.current,
        combo: comboRef.current,
        lives: livesRef.current,
        angles: anglesRef.current.slice(),
        coreLabel: label,
        tutorial: false,
      });
      later(nextBeat, FEEDBACK_MS);
    },
    [later, nextBeat, publish, stopLoop],
  );

  const frame = useCallback(
    (ts: number) => {
      rafRef.current = null;
      if (phaseRef.current !== 'playing' || pausedRef.current) {
        return;
      }
      const last = lastTsRef.current || ts;
      const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
      lastTsRef.current = ts;

      const next = anglesRef.current.slice();
      const active = activeRef.current;
      const step = speedRef.current * dt;
      next[active] = normDeg(next[active] + dirRef.current * step);
      for (let i = 0; i < next.length; i++) {
        if (i !== active) {
          next[i] = normDeg(next[i] + DRIFT_DEG_PER_SEC * dt);
        }
      }
      anglesRef.current = next;
      sweptRef.current += step;

      const limit = LEAD_DEG + arcWidthRef.current * 0.5 + MISS_OVERSHOOT_DEG;
      if (sweptRef.current >= limit) {
        resolveBeat('miss');
        return;
      }

      const now = Date.now();
      if (now - publishedRef.current >= 33) {
        publishedRef.current = now;
        setView(prev => ({...prev, angles: next}));
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [resolveBeat],
  );

  // The loop runs ONLY while a beat is live. Every other phase leaves the
  // window idle, which is what the UI automation needs to read the tree.
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      stopLoop();
      return;
    }
    if (view.phase === 'playing' && rafRef.current === null) {
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(frame);
    }
  }, [frame, paused, stopLoop, view.phase]);

  const tap = useCallback(() => {
    if (finishedRef.current || pausedRef.current) {
      return;
    }
    if (phaseRef.current === 'ready') {
      phaseRef.current = 'countdown';
      publish({phase: 'countdown', coreLabel: '3', tutorial: false});
      const stepMs = Math.round(COUNTDOWN_MS / 3);
      later(() => publish({coreLabel: '2'}), stepMs);
      later(() => publish({coreLabel: '1'}), stepMs * 2);
      later(() => {
        if (!finishedRef.current) {
          armBeat();
        }
      }, COUNTDOWN_MS);
      return;
    }
    if (phaseRef.current !== 'playing') {
      return;
    }
    const delta = angleDelta(
      arcCenterRef.current,
      anglesRef.current[activeRef.current],
    );
    resolveBeat(classifyTap(delta, arcWidthRef.current));
  }, [armBeat, later, publish, resolveBeat]);

  // Hard safety nets. They run regardless of pause so a result always lands.
  useEffect(() => {
    const idle = setTimeout(() => {
      if (phaseRef.current === 'ready') {
        finish();
      }
    }, IDLE_BACKSTOP_MS);
    const cap = setTimeout(finish, MAX_SESSION_MS);
    return () => {
      clearTimeout(idle);
      clearTimeout(cap);
    };
  }, [finish]);

  useEffect(() => {
    const timers = timersRef;
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return {view, tap};
}

export default useOrbitEngine;
