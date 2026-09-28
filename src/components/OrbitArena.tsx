import React, {useMemo} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Defs, Path, RadialGradient, Stop} from 'react-native-svg';
import {
  ARENA_BORDER,
  ARENA_INNER,
  ARENA_PAD,
  ARENA_W,
  MARKER_R,
  ORBIT_R,
  PLANET_D,
  SPIN_TURNS,
} from '../constants/config';
import {C, GRADIENTS} from '../constants/theme';
import {arcPath, polar} from '../game/orbit';

interface Props {
  spin: Animated.Value;
  shake: Animated.Value;
  flash: Animated.Value;
  dir: 1 | -1;
  arcStart: number;
  arcDeg: number;
  beatOn: boolean;
  combo: number;
}

const CENTER = ARENA_INNER / 2;
const TRAIL = [
  {step: 1, opacity: 0.3, r: MARKER_R * 0.72},
  {step: 2, opacity: 0.2, r: MARKER_R * 0.6},
  {step: 3, opacity: 0.12, r: MARKER_R * 0.48},
  {step: 4, opacity: 0.06, r: MARKER_R * 0.36},
];

export default function OrbitArena({
  spin,
  shake,
  flash,
  dir,
  arcStart,
  arcDeg,
  beatOn,
  combo,
}: Props) {
  const rotate = useMemo(
    () =>
      spin.interpolate({
        inputRange: [0, SPIN_TURNS],
        outputRange: ['0deg', String(dir * 360 * SPIN_TURNS) + 'deg'],
      }),
    [dir, spin],
  );

  const shift = useMemo(
    () =>
      shake.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-6, 0, 6],
      }),
    [shake],
  );

  const flashOpacity = useMemo(
    () =>
      flash.interpolate({
        inputRange: [0, 0.25, 1],
        outputRange: [0, 0.75, 0],
      }),
    [flash],
  );

  const path = useMemo(
    () => arcPath(CENTER, CENTER, ORBIT_R, arcStart, dir * arcDeg),
    [arcStart, arcDeg, dir],
  );

  const trail = useMemo(
    () =>
      TRAIL.map(t => {
        const p = polar(CENTER, CENTER, ORBIT_R, -90 - dir * t.step * 9);
        return {...t, x: p.x, y: p.y};
      }),
    [dir],
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.frame, {transform: [{translateX: shift}]}]}>
      <View style={styles.inner}>
        <Svg width={ARENA_INNER} height={ARENA_INNER}>
          <Defs>
            <RadialGradient id="bloomA" cx="30%" cy="28%" r="60%">
              <Stop offset="0" stopColor="#5B8CFF" stopOpacity="0.30" />
              <Stop offset="1" stopColor="#5B8CFF" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bloomB" cx="72%" cy="74%" r="58%">
              <Stop offset="0" stopColor="#7C4DFF" stopOpacity="0.28" />
              <Stop offset="1" stopColor="#7C4DFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          <Circle cx={CENTER} cy={CENTER} r={CENTER} fill="url(#bloomA)" />
          <Circle cx={CENTER} cy={CENTER} r={CENTER} fill="url(#bloomB)" />

          <Circle
            cx={CENTER}
            cy={CENTER}
            r={ORBIT_R}
            stroke="rgba(91,140,255,0.22)"
            strokeWidth={1.5}
            fill="none"
          />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={ORBIT_R - 22}
            stroke="rgba(245,247,255,0.10)"
            strokeWidth={1}
            strokeDasharray="4 10"
            fill="none"
          />

          {beatOn ? (
            <Path
              d={path}
              stroke={C.accent}
              strokeOpacity={0.25}
              strokeWidth={20}
              strokeLinecap="round"
              fill="none"
            />
          ) : null}
          <Path
            d={path}
            stroke={beatOn ? C.accent : 'rgba(245,247,255,0.10)'}
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>

        <Animated.View
          pointerEvents="none"
          style={[styles.ringFlash, {opacity: flashOpacity}]}
        />

        <Animated.View
          pointerEvents="none"
          style={[styles.spinLayer, {transform: [{rotate}]}]}>
          {trail.map(t => (
            <View
              key={t.step}
              style={[
                styles.trailDot,
                {
                  left: t.x - t.r,
                  top: t.y - t.r,
                  width: t.r * 2,
                  height: t.r * 2,
                  borderRadius: t.r,
                  opacity: t.opacity,
                },
              ]}
            />
          ))}
          <View style={styles.markerSlot}>
            <LinearGradient
              colors={['#F5F7FF', '#5B8CFF']}
              start={{x: 0.2, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.marker}
            />
          </View>
        </Animated.View>

        <View pointerEvents="none" style={styles.planetSlot}>
          <LinearGradient
            colors={GRADIENTS.planet}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.planet}>
            <Text style={styles.comboValue}>{combo}</Text>
            <Text style={styles.comboLabel}>COMBO</Text>
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: ARENA_W,
    height: ARENA_W,
    borderRadius: ARENA_W / 2,
    borderWidth: ARENA_BORDER,
    borderColor: 'rgba(91,140,255,0.28)',
    padding: ARENA_PAD,
    backgroundColor: 'rgba(7,12,30,0.42)',
    overflow: 'hidden',
  },
  inner: {width: ARENA_INNER, height: ARENA_INNER},
  spinLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ARENA_INNER,
    height: ARENA_INNER,
  },
  trailDot: {position: 'absolute', backgroundColor: '#F5F7FF'},
  markerSlot: {
    position: 'absolute',
    left: CENTER - MARKER_R,
    top: CENTER - ORBIT_R - MARKER_R,
    width: MARKER_R * 2,
    height: MARKER_R * 2,
    borderRadius: MARKER_R,
    shadowColor: '#5B8CFF',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  marker: {
    width: MARKER_R * 2,
    height: MARKER_R * 2,
    borderRadius: MARKER_R,
    borderWidth: 1,
    borderColor: 'rgba(245,247,255,0.65)',
  },
  ringFlash: {
    position: 'absolute',
    left: CENTER - ORBIT_R - 6,
    top: CENTER - ORBIT_R - 6,
    width: (ORBIT_R + 6) * 2,
    height: (ORBIT_R + 6) * 2,
    borderRadius: ORBIT_R + 6,
    borderWidth: 3,
    borderColor: '#5B8CFF',
  },
  planetSlot: {
    position: 'absolute',
    left: CENTER - PLANET_D / 2,
    top: CENTER - PLANET_D / 2,
    width: PLANET_D,
    height: PLANET_D,
  },
  planet: {
    width: PLANET_D,
    height: PLANET_D,
    borderRadius: PLANET_D / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,247,255,0.16)',
  },
  comboValue: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
    color: C.text,
    letterSpacing: 0.5,
  },
  comboLabel: {
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(245,247,255,0.7)',
  },
});
