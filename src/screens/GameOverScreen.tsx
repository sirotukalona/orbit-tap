import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Flame, RotateCcw, Target, Trophy} from 'lucide-react-native';
import AuroraBackground from '../components/AuroraBackground';
import ScreenHeader from '../components/ScreenHeader';
import ResultBadge from '../components/ResultBadge';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatRow, {StatItem} from '../components/StatRow';
import {C, GRADIENTS} from '../constants/theme';
import {IMAGES} from '../assets';
import {SessionResult} from '../game/scoring';

interface Props {
  result: SessionResult;
  best: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export default function GameOverScreen({result, best, onPlayAgain, onMenu}: Props) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 54,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const won = result.outcome === 'complete';
  const tint = won ? C.primary : C.accent;
  const title = won ? 'ORBIT COMPLETE!' : 'MISSION FAILED';
  const caption = won
    ? 'EVERY BEAT LANDED'
    : result.outcome === 'timeout'
    ? 'THE ORBIT WENT QUIET'
    : 'THREE BEATS SLIPPED AWAY';

  const stats: StatItem[] = [
    {key: 'score', value: result.score, label: 'SCORE', tint: C.primary, Icon: Target},
    {key: 'combo', value: result.bestCombo, label: 'BEST STREAK', tint: C.accent, Icon: Flame},
    {key: 'round', value: result.round, label: 'ROUND', tint: C.secondary, Icon: Trophy},
  ];

  return (
    <AuroraBackground image={IMAGES.bgGame} veil={GRADIENTS.resultVeil}>
      <ScreenHeader transparent
        title="MISSION REPORT"
        rightSlot={
          <View style={styles.badge}>
            <Trophy size={16} color={C.primary} strokeWidth={2.4} />
            <Text style={styles.badgeText}>{'BEST ' + best}</Text>
          </View>
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            opacity: enter,
            transform: [
              {scale: enter.interpolate({inputRange: [0, 1], outputRange: [0.9, 1]})},
            ],
          },
        ]}>
        <ResultBadge title={title} caption={caption} tint={tint} />

        <View style={styles.statsWrap}>
          <StatRow items={stats} />
        </View>

        <Text style={styles.hint}>ONE TAP PER GLOWING ARC</Text>
      </Animated.View>

      <View style={styles.actions}>
        <PrimaryButton label="PLAY AGAIN" onPress={onPlayAgain} Icon={RotateCcw} />
        <View style={styles.gap} />
        <SecondaryButton label="NEW MISSION" onPress={onMenu} Icon={Target} />
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
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
  statsWrap: {marginTop: 30, width: '100%'},
  hint: {
    marginTop: 26,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: C.textFaint,
  },
  actions: {paddingHorizontal: 24, paddingBottom: 36},
  gap: {height: 12},
});
