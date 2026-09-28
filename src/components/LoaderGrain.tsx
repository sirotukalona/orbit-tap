import React, {useMemo} from 'react';
import Svg, {Circle} from 'react-native-svg';
import {LOADER_GRAIN_COUNT, SCREEN_H, SCREEN_W} from '../constants/config';

const TINTS = [
  'rgba(245,247,255,0.90)',
  'rgba(245,247,255,0.45)',
  'rgba(91,140,255,0.70)',
  'rgba(255,107,154,0.55)',
  'rgba(124,77,255,0.50)',
];

/**
 * Static full-canvas starfield. Deterministic xorshift so the field is stable
 * between renders, built inside useMemo (never at module scope, which would be
 * sync work at mount). It also gives the splash frame enough entropy that its
 * PNG stays clearly heavier than the Menu frame — the capture loop picks the
 * largest pre-menu frame as 01_LoaderScreen.
 */
function LoaderGrain() {
  const dots = useMemo(() => {
    let s = 0x9e3779b9 >>> 0;
    const rnd = () => {
      s ^= s << 13;
      s >>>= 0;
      s ^= s >> 17;
      s ^= s << 5;
      s >>>= 0;
      return s / 4294967296;
    };
    const out: {x: number; y: number; r: number; c: string}[] = [];
    for (let i = 0; i < LOADER_GRAIN_COUNT; i++) {
      out.push({
        x: rnd() * SCREEN_W,
        y: rnd() * SCREEN_H,
        r: 0.6 + rnd() * 1.0,
        c: TINTS[i % TINTS.length],
      });
    }
    return out;
  }, []);

  return (
    <Svg width={SCREEN_W} height={SCREEN_H}>
      {dots.map((d, i) => (
        <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} />
      ))}
    </Svg>
  );
}

export default React.memo(LoaderGrain);
