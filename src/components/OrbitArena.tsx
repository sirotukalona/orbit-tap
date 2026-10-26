import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

import {
  BOARD_BORDER,
  BOARD_PAD,
  ARENA,
  CENTER,
  INNER,
  RING_RADII,
} from '../constants/config';
import theme from '../constants/theme';
import {describeArc, polarToXY} from '../game/orbit';
import type {EngineView} from '../hooks/useOrbitEngine';
import PlanetSprite from './PlanetSprite';
import {PLANET_SPRITES} from '../assets';

const IDLE_ARC_CENTERS = [48, 196, 304];
const IDLE_ARC_WIDTH = 42;
const TAIL = [1, 2, 3, 4];

interface Props {
  view: EngineView;
}

function feedbackColor(feedback: EngineView['feedback']): string {
  if (feedback === 'perfect') {
    return theme.colors.accent;
  }
  if (feedback === 'hit') {
    return theme.colors.success;
  }
  if (feedback === 'miss') {
    return theme.colors.danger;
  }
  return theme.colors.primary;
}

/** Pure render of the orbit board. Holds no timers of its own. */
function OrbitArena({view}: Props) {
  const {angles, activeRing, arcCenterDeg, arcWidthDeg, feedback, direction} =
    view;
  const live = view.phase === 'playing' || view.phase === 'resolving';
  const flash = feedbackColor(feedback);

  const rings = useMemo(
    () =>
      RING_RADII.map((radius, i) => ({
        radius,
        idleArc: describeArc(
          CENTER,
          CENTER,
          radius,
          IDLE_ARC_CENTERS[i] - IDLE_ARC_WIDTH / 2,
          IDLE_ARC_CENTERS[i] + IDLE_ARC_WIDTH / 2,
        ),
      })),
    [],
  );

  const activeRadius = RING_RADII[activeRing];
  const half = arcWidthDeg / 2;
  const activeArc = describeArc(
    CENTER,
    CENTER,
    activeRadius,
    arcCenterDeg - half,
    arcCenterDeg + half,
  );
  const perfectArc = describeArc(
    CENTER,
    CENTER,
    activeRadius,
    arcCenterDeg - half / 3,
    arcCenterDeg + half / 3,
  );

  const planetPoints = angles.map((deg, i) =>
    polarToXY(CENTER, CENTER, RING_RADII[i], deg),
  );

  const tailPoints = live
    ? TAIL.map(k =>
        polarToXY(
          CENTER,
          CENTER,
          activeRadius,
          angles[activeRing] - direction * k * 5,
        ),
      )
    : [];

  return (
    <View style={[styles.card, {borderColor: flash + '55'}]}>
      <View style={styles.inner}>
        <Svg width={INNER} height={INNER}>
          <Defs>
            <SvgGradient id="arc" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={theme.colors.primary} />
              <Stop offset="1" stopColor={theme.colors.secondary} />
            </SvgGradient>
            <RadialGradient id="core" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={theme.colors.secondary} stopOpacity="0.42" />
              <Stop offset="1" stopColor={theme.colors.secondary} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {rings.map((ring, i) => (
            <Circle
              key={'ring' + i}
              cx={CENTER}
              cy={CENTER}
              r={ring.radius}
              stroke={theme.colors.ringTrack}
              strokeWidth={1.5}
              strokeDasharray="4 10"
              fill="none"
            />
          ))}

          {rings.map((ring, i) =>
            i === activeRing ? null : (
              <Path
                key={'idle' + i}
                d={ring.idleArc}
                stroke="url(#arc)"
                strokeWidth={9}
                strokeLinecap="round"
                opacity={0.25}
                fill="none"
              />
            ),
          )}

          <Path
            d={activeArc}
            stroke="url(#arc)"
            strokeWidth={9}
            strokeLinecap="round"
            opacity={live ? 1 : 0.8}
            fill="none"
          />
          <Path
            d={perfectArc}
            stroke={feedback === 'none' ? theme.colors.accent : flash}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={0.9}
            fill="none"
          />

          {tailPoints.map((p, i) => (
            <Circle
              key={'tail' + i}
              cx={p.x}
              cy={p.y}
              r={4 - i * 0.7}
              fill={theme.colors.accent}
              opacity={0.42 - i * 0.09}
            />
          ))}

          <Circle cx={CENTER} cy={CENTER} r={36} fill="url(#core)" />
          <Circle
            cx={CENTER}
            cy={CENTER}
            r={36}
            stroke={theme.colors.borderSoft}
            strokeWidth={1}
            fill="none"
          />
        </Svg>

        {planetPoints.map((p, i) => (
          <PlanetSprite
            key={'planet' + i}
            source={PLANET_SPRITES[i]}
            x={p.x}
            y={p.y}
            dim={live && i !== activeRing}
          />
        ))}

        <View style={styles.coreLabelWrap} pointerEvents="none">
          <Text style={styles.coreLabel} numberOfLines={2}>
            {view.coreLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ARENA,
    height: ARENA,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderRadius: theme.radius.xxl,
    backgroundColor: 'rgba(16,16,58,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.45,
    shadowRadius: 30,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  inner: {
    width: INNER,
    height: INNER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreLabelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CENTER - 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  coreLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text,
  },
});

export default React.memo(OrbitArena);
