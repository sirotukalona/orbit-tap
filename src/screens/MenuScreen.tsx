import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Orbit, Play, Repeat, Trophy} from 'lucide-react-native';
import AuroraBackground from '../components/AuroraBackground';
import ScreenHeader from '../components/ScreenHeader';
import MissionChip from '../components/MissionChip';
import PrimaryButton from '../components/PrimaryButton';
import StatRow, {StatItem} from '../components/StatRow';
import {C, GRADIENTS} from '../constants/theme';
import {MISSIONS} from '../constants/config';
import {IMAGES} from '../assets';
import {profile} from '../game/store';

interface Props {
  onLaunch: (startRound: number) => void;
}

export default function MenuScreen({onLaunch}: Props) {
  const [picked, setPicked] = useState(0);
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rise, {
      toValue: 1,
      tension: 52,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const mission = MISSIONS[picked];
  const best = profile.best();
  const runs = profile.runs();

  const launch = useCallback(() => {
    onLaunch(MISSIONS[picked].startRound);
  }, [onLaunch, picked]);

  const stats: StatItem[] = [
    {key: 'best', value: best, label: 'BEST SCORE', tint: C.primary, Icon: Trophy},
    {key: 'runs', value: runs, label: 'RUNS FLOWN', tint: C.accent, Icon: Repeat},
  ];

  return (
    <AuroraBackground image={IMAGES.bgMenu} veil={GRADIENTS.menuVeil}>
      <ScreenHeader transparent
        title="ORBIT CONTROL"
        leftSlot={
          <View style={styles.badge}>
            <Orbit size={16} color={C.primary} strokeWidth={2.4} />
            <Text style={styles.badgeText}>ARCADE</Text>
          </View>
        }
        rightSlot={
          <View style={styles.badge}>
            <Trophy size={16} color={C.accent} strokeWidth={2.4} />
            <Text style={styles.badgeText}>{'BEST ' + best}</Text>
          </View>
        }
      />

      <View style={styles.spacer} />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sheetWrap,
          {
            transform: [
              {translateY: rise.interpolate({inputRange: [0, 1], outputRange: [40, 0]})},
            ],
            opacity: rise,
          },
        ]}>
        <LinearGradient
          colors={GRADIENTS.sheetGlow}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.sheetGlow}
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>ORBIT TAP</Text>
          <Text style={styles.tagline}>NEON ORBITS · PERFECT TIMING</Text>

          <View style={styles.chips}>
            {MISSIONS.map((m, i) => (
              <MissionChip
                key={m.id}
                name={m.name}
                active={i === picked}
                onPress={() => setPicked(i)}
              />
            ))}
          </View>
          <Text style={styles.blurb}>{mission.blurb}</Text>

          <View style={styles.statsWrap}>
            <StatRow items={stats} />
          </View>

          <Text style={styles.howto}>HOW TO PLAY · TAP WHEN THE ARC GLOWS</Text>
          <PrimaryButton label="START MISSION" onPress={launch} Icon={Play} />
        </View>
      </Animated.View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  spacer: {flex: 1},
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: C.glass,
    borderWidth: 1,
    borderColor: C.glassLine,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: C.textMuted,
  },
  sheetWrap: {width: '100%'},
  sheetGlow: {height: 2, width: '100%'},
  sheet: {
    backgroundColor: 'rgba(12,18,44,0.86)',
    borderTopWidth: 1,
    borderColor: C.border,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
  },
  title: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: 4,
    color: C.text,
    textShadowColor: 'rgba(91,140,255,0.8)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 16,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: 'rgba(245,247,255,0.55)',
  },
  chips: {flexDirection: 'row', gap: 10, marginTop: 20},
  blurb: {
    marginTop: 10,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.textFaint,
  },
  statsWrap: {marginTop: 18},
  howto: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: 'rgba(245,247,255,0.5)',
  },
});
