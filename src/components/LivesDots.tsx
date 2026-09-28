import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import {C} from '../constants/theme';
import {MISS_LIMIT} from '../constants/config';

interface Props {
  lives: number;
}

const R = 5;
const GAP = 16;

export default function LivesDots({lives}: Props) {
  const width = GAP * MISS_LIMIT;
  return (
    <Svg width={width} height={14}>
      {Array.from({length: MISS_LIMIT}).map((_, i) => {
        const alive = i < lives;
        return (
          <Circle
            key={i}
            cx={R + 1 + i * GAP}
            cy={7}
            r={alive ? R : R - 1}
            fill={alive ? C.accent : 'rgba(255,255,255,0.12)'}
            stroke={alive ? 'rgba(255,107,154,0.45)' : 'transparent'}
            strokeWidth={alive ? 3 : 0}
          />
        );
      })}
    </Svg>
  );
}
