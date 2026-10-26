import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Crosshair, Flame, Rocket, Trophy} from 'lucide-react-native';

import {type DifficultyId} from '../constants/config';
import theme from '../constants/theme';
import AuroraBackground from '../components/AuroraBackground';
import DifficultyChips from '../components/DifficultyChips';
import GradientButton from '../components/GradientButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import {getStats} from '../game/stats';

interface Props {
  difficulty: DifficultyId;
  onDifficulty: (id: DifficultyId) => void;
  onLaunch: () => void;
}

/** M2 bottom-sheet menu: AI art on top, frosted control sheet below. */
function MenuScreen({difficulty, onDifficulty, onLaunch}: Props) {
  const rise = useRef(new Animated.Value(0)).current;
  const [stats] = useState(() => getStats());

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const handleChange = useCallback(
    (id: DifficultyId) => onDifficulty(id),
    [onDifficulty],
  );

  const showStats = stats.totalPerfects > 0 && stats.bestStreak > 0;

  return (
    <View style={styles.root}>
      <AuroraBackground variant="menu">
        <View style={styles.layout}>
          <ScreenHeader
            transparent
            title="ORBITTAP"
            leftSlot={
              <Rocket size={18} color={theme.colors.primary} strokeWidth={2.2} />
            }
            rightSlot={
              <View style={styles.badge}>
                <Trophy size={14} color={theme.colors.accent} strokeWidth={2.4} />
                <Text style={styles.badgeText}>
                  {'BEST ' + String(stats.bestScore)}
                </Text>
              </View>
            }
          />

          <View style={styles.art} />

          <LinearGradient
            colors={theme.gradients.sheetFade}
            style={styles.fade}
            pointerEvents="none"
          />

          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.sheet,
              {
                opacity: rise,
                transform: [
                  {
                    translateY: rise.interpolate({
                      inputRange: [0, 1],
                      outputRange: [36, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.title}>ORBIT TAP</Text>
            <Text style={styles.tagline}>
              THREE RINGS · THREE LIVES · ONE TAP
            </Text>
            <Text style={styles.hint}>
              TAP WHEN A PLANET CROSSES ITS GLOWING ARC.
            </Text>
            <Text style={styles.hint}>
              HIT THE ARC CENTRE FOR A PERFECT x2.
            </Text>

            <View style={styles.chips}>
              <DifficultyChips value={difficulty} onChange={handleChange} />
            </View>

            {showStats ? (
              <View style={styles.statsRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Crosshair}
                    value={String(stats.totalPerfects)}
                    label="PERFECTS"
                    valueColor={theme.colors.accent}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    Icon={Flame}
                    value={String(stats.bestStreak)}
                    label="STREAK"
                    valueColor={theme.colors.success}
                  />
                </View>
              </View>
            ) : null}

            <View style={styles.cta}>
              <GradientButton
                label="START MISSION"
                Icon={Rocket}
                onPress={onLaunch}
              />
            </View>
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
  art: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(245,247,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,247,255,0.14)',
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 240,
  },
  sheet: {
    borderTopLeftRadius: theme.radius.xxl,
    borderTopRightRadius: theme.radius.xxl,
    backgroundColor: 'rgba(20,27,61,0.88)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(245,247,255,0.12)',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 28,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: {width: 0, height: -6},
    elevation: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.textDim,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.textMute,
  },
  chips: {
    marginTop: 18,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  cta: {
    marginTop: 18,
  },
});

export default MenuScreen;
