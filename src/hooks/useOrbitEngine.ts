import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, Vibration} from 'react-native';
import {
  BEAT_LEAD_DEG,
  FIRST_BEAT_DELAY_MS,
  MISS_GRACE_MS,
  MISS_LIMIT,
  ROUNDS,
  ROUND_BEATS,
  ROUND_TIMEOUT_MS,
  SESSION_WARMUP_BEATS,
  SESSION_WARMUP_GAP_MS,
  SPIN_TURNS,
} from '../constants/config';
import {angleAt, arcOffset, norm360} from '../game/orbit';
import {hitPoints, hitQuality, Outcome, SessionResult} from '../game/scoring';

const START_ANGLE = -90; // marker sits at 12 o'clock when a round opens

interface Pending {
  due: number;
  left: number;
}

export interface FloatScore {
  id: number;
  text: string;
}

export interface OrbitEngine {
  spin: Animated.Value;
  shake: Animated.Value;
  flash: Animated.Value;
  round: number;
  arcStart: number;
  arcDeg: number;
  dir: 1 | -1;
  beatOn: boolean;
  score: number;
  combo: number;
  bestCombo: number;
  lives: number;
  beatsDone: number;
  paused: boolean;
  floater: FloatScore | null;
  tap: () => void;
  pause: () => void;
  resume: () => void;
  quit: () => void;
}

function buzz(ms: number) {
  try {
    Vibration.vibrate(ms);
  } catch (e) {
    // haptics are cosmetic: an absent vibrator must never break a round
  }
}

export function useOrbitEngine(
  startRound: number,
  onFinish: (result: SessionResult) => void,
): OrbitEngine {
  const spin = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const flash = useRef(new Animated.Value(0)).current;

  const [round, setRound] = useState(startRound);
  const [arcStart, setArcStart] = useState(START_ANGLE);
  const [beatOn, setBeatOn] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(MISS_LIMIT);
  const [beatsDone, setBeatsDone] = useState(0);
  const [paused, setPaused] = useState(false);
  const [floater, setFloater] = useState<FloatScore | null>(null);

  // Mutable mirrors: timer callbacks must never read stale state (CLAUDE.md #8).
  const roundRef = useRef(startRound);
  const arcStartRef = useRef(START_ANGLE);
  const beatOnRef = useRef(false);
  const comboRef = useRef(0);
  const bestComboRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(MISS_LIMIT);
  const beatsRef = useRef(0);
  const sessionBeatsRef = useRef(0);
  const roundStartRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pausedAtRef = useRef(0);
  const spinValRef = useRef(0);
  const doneRef = useRef(false);
  const floaterIdRef = useRef(0);

  const beatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const beatPending = useRef<Pending>({due: 0, left: 0});
  const missPending = useRef<Pending>({due: 0, left: 0});
  const roundPending = useRef<Pending>({due: 0, left: 0});
  const scheduleBeatRef = useRef<(gapMs: number) => void>(() => {});
  const openBeatRef = useRef<() => void>(() => {});

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const spec = ROUNDS[Math.min(round, ROUNDS.length - 1)];

  const clearTimers = useCallback(() => {
    if (beatTimer.current) {
      clearTimeout(beatTimer.current);
      beatTimer.current = null;
    }
    if (missTimer.current) {
      clearTimeout(missTimer.current);
      missTimer.current = null;
    }
    if (roundTimer.current) {
      clearTimeout(roundTimer.current);
      roundTimer.current = null;
    }
  }, []);

  const currentAngle = useCallback(() => {
    const cfg = ROUNDS[Math.min(roundRef.current, ROUNDS.length - 1)];
    const elapsed = Date.now() - roundStartRef.current - pausedAccumRef.current;
    return angleAt(START_ANGLE, cfg.dir, cfg.periodMs, elapsed);
  }, []);

  const startSpin = useCallback(
    (fromValue: number, periodMs: number) => {
      spin.setValue(fromValue);
      spinValRef.current = fromValue;
      Animated.timing(spin, {
        toValue: SPIN_TURNS,
        duration: Math.max(200, (SPIN_TURNS - fromValue) * periodMs),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    },
    [spin],
  );

  const finish = useCallback(
    (outcome: Outcome) => {
      if (doneRef.current) {
        return;
      }
      doneRef.current = true;
      clearTimers();
      spin.stopAnimation();
      beatOnRef.current = false;
      setBeatOn(false);
      const result: SessionResult = {
        outcome,
        score: scoreRef.current,
        bestCombo: bestComboRef.current,
        round: roundRef.current + 1,
      };
      finishRef.current(result);
    },
    [clearTimers, spin],
  );

  const armMiss = useCallback(
    (delay: number) => {
      missPending.current = {due: Date.now() + delay, left: delay};
      if (missTimer.current) {
        clearTimeout(missTimer.current);
      }
      missTimer.current = setTimeout(() => {
        missTimer.current = null;
        if (doneRef.current) {
          return;
        }
        beatOnRef.current = false;
        setBeatOn(false);
        comboRef.current = 0;
        setCombo(0);
        livesRef.current -= 1;
        setLives(livesRef.current);
        buzz(24);
        Animated.sequence([
          Animated.timing(shake, {toValue: 1, duration: 60, useNativeDriver: true}),
          Animated.timing(shake, {toValue: -1, duration: 60, useNativeDriver: true}),
          Animated.timing(shake, {toValue: 0, duration: 60, useNativeDriver: true}),
        ]).start();
        if (livesRef.current <= 0) {
          finish('failed');
          return;
        }
        const cfg = ROUNDS[Math.min(roundRef.current, ROUNDS.length - 1)];
        scheduleBeatRef.current(cfg.beatGapMs);
      }, delay);
    },
    [finish, shake],
  );

  const openBeat = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    const cfg = ROUNDS[Math.min(roundRef.current, ROUNDS.length - 1)];
    const lead = BEAT_LEAD_DEG;
    const next = norm360(currentAngle() + cfg.dir * lead);
    arcStartRef.current = next;
    setArcStart(next);
    beatOnRef.current = true;
    setBeatOn(true);
    const windowMs = ((lead + cfg.arcDeg) / 360) * cfg.periodMs + MISS_GRACE_MS;
    armMiss(windowMs);
  }, [armMiss, currentAngle]);
  openBeatRef.current = openBeat;

  const scheduleBeat = useCallback((gapMs: number) => {
    const gap =
      sessionBeatsRef.current < SESSION_WARMUP_BEATS
        ? Math.max(gapMs, SESSION_WARMUP_GAP_MS)
        : gapMs;
    beatPending.current = {due: Date.now() + gap, left: gap};
    if (beatTimer.current) {
      clearTimeout(beatTimer.current);
    }
    beatTimer.current = setTimeout(() => {
      beatTimer.current = null;
      sessionBeatsRef.current += 1;
      openBeatRef.current();
    }, gap);
  }, []);
  scheduleBeatRef.current = scheduleBeat;

  const armRoundBackstop = useCallback(() => {
    roundPending.current = {
      due: Date.now() + ROUND_TIMEOUT_MS,
      left: ROUND_TIMEOUT_MS,
    };
    if (roundTimer.current) {
      clearTimeout(roundTimer.current);
    }
    roundTimer.current = setTimeout(() => {
      roundTimer.current = null;
      finish('timeout');
    }, ROUND_TIMEOUT_MS);
  }, [finish]);

  const enterRound = useCallback(
    (index: number, firstDelay: number) => {
      roundRef.current = index;
      setRound(index);
      beatsRef.current = 0;
      setBeatsDone(0);
      roundStartRef.current = Date.now();
      pausedAccumRef.current = 0;
      beatOnRef.current = false;
      setBeatOn(false);
      startSpin(0, ROUNDS[Math.min(index, ROUNDS.length - 1)].periodMs);
      scheduleBeatRef.current(firstDelay);
      armRoundBackstop();
    },
    [armRoundBackstop, startSpin],
  );

  const enterRoundRef = useRef(enterRound);
  enterRoundRef.current = enterRound;

  useEffect(() => {
    doneRef.current = false;
    enterRoundRef.current(
      Math.min(Math.max(0, startRound), ROUNDS.length - 1),
      FIRST_BEAT_DELAY_MS,
    );
    const stop = () => {
      doneRef.current = true;
      if (beatTimer.current) {
        clearTimeout(beatTimer.current);
      }
      if (missTimer.current) {
        clearTimeout(missTimer.current);
      }
      if (roundTimer.current) {
        clearTimeout(roundTimer.current);
      }
      spin.stopAnimation();
    };
    return stop;
  }, [spin, startRound]);

  const tap = useCallback(() => {
    if (doneRef.current || !beatOnRef.current || pausedAtRef.current > 0) {
      return; // taps outside a lit beat are neutral, never a penalty
    }
    const cfg = ROUNDS[Math.min(roundRef.current, ROUNDS.length - 1)];
    const offset = arcOffset(currentAngle(), arcStartRef.current, cfg.dir);
    if (offset > cfg.arcDeg) {
      return;
    }
    if (missTimer.current) {
      clearTimeout(missTimer.current);
      missTimer.current = null;
    }
    beatOnRef.current = false;
    setBeatOn(false);

    const quality = hitQuality(offset, cfg.arcDeg);
    const gained = hitPoints(comboRef.current, quality);
    comboRef.current += 1;
    scoreRef.current += gained;
    if (comboRef.current > bestComboRef.current) {
      bestComboRef.current = comboRef.current;
      setBestCombo(comboRef.current);
    }
    setCombo(comboRef.current);
    setScore(scoreRef.current);
    floaterIdRef.current += 1;
    setFloater({
      id: floaterIdRef.current,
      text: (quality === 'perfect' ? 'PERFECT +' : '+') + gained,
    });
    buzz(12);
    flash.setValue(0);
    Animated.timing(flash, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    beatsRef.current += 1;
    setBeatsDone(beatsRef.current);

    if (beatsRef.current >= ROUND_BEATS) {
      const next = roundRef.current + 1;
      if (next >= ROUNDS.length) {
        finish('complete');
        return;
      }
      enterRoundRef.current(next, ROUNDS[next].beatGapMs);
      return;
    }
    scheduleBeatRef.current(cfg.beatGapMs);
  }, [currentAngle, finish, flash]);

  const pause = useCallback(() => {
    if (doneRef.current || pausedAtRef.current > 0) {
      return;
    }
    const now = Date.now();
    pausedAtRef.current = now;
    setPaused(true);
    beatPending.current.left = Math.max(0, beatPending.current.due - now);
    missPending.current.left = Math.max(0, missPending.current.due - now);
    roundPending.current.left = Math.max(0, roundPending.current.due - now);
    clearTimers();
    spin.stopAnimation(v => {
      spinValRef.current = v;
    });
  }, [clearTimers, spin]);

  const resume = useCallback(() => {
    if (doneRef.current || pausedAtRef.current === 0) {
      return;
    }
    const now = Date.now();
    pausedAccumRef.current += now - pausedAtRef.current;
    pausedAtRef.current = 0;
    setPaused(false);
    const cfg = ROUNDS[Math.min(roundRef.current, ROUNDS.length - 1)];
    startSpin(spinValRef.current, cfg.periodMs);
    if (beatOnRef.current && missPending.current.left > 0) {
      armMiss(missPending.current.left);
    } else if (beatPending.current.left > 0) {
      const wait = beatPending.current.left;
      beatPending.current = {due: now + wait, left: wait};
      beatTimer.current = setTimeout(() => {
        beatTimer.current = null;
        sessionBeatsRef.current += 1;
        openBeatRef.current();
      }, wait);
    }
    const leftRound = Math.max(1000, roundPending.current.left);
    roundPending.current = {due: now + leftRound, left: leftRound};
    roundTimer.current = setTimeout(() => {
      roundTimer.current = null;
      finish('timeout');
    }, leftRound);
  }, [armMiss, finish, startSpin]);

  const quit = useCallback(() => {
    pausedAtRef.current = 0;
    setPaused(false);
    finish('failed');
  }, [finish]);

  return useMemo(
    () => ({
      spin,
      shake,
      flash,
      round,
      arcStart,
      arcDeg: spec.arcDeg,
      dir: spec.dir,
      beatOn,
      score,
      combo,
      bestCombo,
      lives,
      beatsDone,
      paused,
      floater,
      tap,
      pause,
      resume,
      quit,
    }),
    [
      spin,
      shake,
      flash,
      round,
      arcStart,
      spec.arcDeg,
      spec.dir,
      beatOn,
      score,
      combo,
      bestCombo,
      lives,
      beatsDone,
      paused,
      floater,
      tap,
      pause,
      resume,
      quit,
    ],
  );
}
