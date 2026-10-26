import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {
  Crosshair,
  Flame,
  House,
  Rocket,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react-native';

import theme from '../constants/theme';
import AuroraBackground from '../components/AuroraBackground';
import GradientButton from '../components/GradientButton';
import ScoreCounter from '../components/ScoreCounter';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import type {RunResult} from '../game/stats';

interface Props {
  result: RunResult;
  isBest: boolean;
  onAgain: () => void;
  onMenu: () => void;
}

/** Results screen. Owner of the single retry CTA in the app. */
function GameOverScreen({result, isBest, onAgain, onMenu}: Props) {
  const badge = useRef(new Animated.Value(0)).current;
  const cards = useRef(new Animated.Value(0)).current;
  const actions = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(badge, {
      toValue: 1,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();
    Animated.timing(cards, {
      toValue: 1,
      delay: 140,
      duration: 360,
      useNativeDriver: true,
    }).start();
    Animated.timing(actions, {
      toValue: 1,
      delay: 380,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [actions, badge, cards]);

  const Verdict = isBest ? Rocket : Trophy;

  return (
    <View style={styles.root}>
      <AuroraBackground variant="result">
        <View style={styles.layout}>
          <ScreenHeader transparent title="MISSION REPORT" />

          <View style={styles.body}>
            <Animated.View
              style={[
                styles.badgeWrap,
                {opacity: badge, transform: [{scale: badge}]},
              ]}>
              <View style={styles.badge}>
                <Verdict size={34} color={theme.colors.accent} strokeWidth={2} />
              </View>
            </Animated.View>

            <Text style={styles.verdict}>MISSION ENDED</Text>

            <Text style={styles.scoreLabel}>SCORE</Text>
            <ScoreCounter value={result.score} />

            <Animated.View
              style={[
                styles.statsRow,
                {
                  opacity: cards,
                  transform: [
                    {
                      translateY: cards.interpolate({
                        inputRange: [0, 1],
                        outputRange: [14, 0],
                      }),
                    },
                  ],
                },
              ]}>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Target}
                  value={String(result.round)}
                  label="ROUND"
                  valueColor={theme.colors.primary}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Crosshair}
                  value={String(result.perfects)}
                  label="PERFECT"
                  valueColor={theme.colors.accent}
                />
              </View>
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Flame}
                  value={String(result.bestStreak)}
                  label="BEST STREAK"
                  valueColor={theme.colors.success}
                />
              </View>
            </Animated.View>

            {isBest ? (
              <View style={styles.record}>
                <Text style={styles.recordText}>NEW RECORD</Text>
              </View>
            ) : null}
          </View>

          <Animated.View
            pointerEvents="box-none"
            style={[styles.actions, {opacity: actions}]}>
            <GradientButton
              label="PLAY AGAIN"
              Icon={RotateCcw}
              onPress={onAgain}
            />
            <View style={styles.gap} />
            <GradientButton
              label="MENU"
              Icon={House}
              onPress={onMenu}
              variant="secondary"
            />
          </Animated.View>
        </View>
      </AuroraBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  layout: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,154,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,154,0.42)',
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  verdict: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  scoreLabel: {
    marginTop: 22,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textMute,
  },
  statsRow: {
    marginTop: 26,
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
  },
  statSlot: {
    flex: 1,
  },
  record: {
    marginTop: 18,
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(77,232,194,0.14)',
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  recordText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.success,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  gap: {
    height: 12,
  },
});

export default GameOverScreen;
