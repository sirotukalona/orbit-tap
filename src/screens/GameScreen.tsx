import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {Pause, Target, Zap} from 'lucide-react-native';

import {ARENA, type DifficultyId} from '../constants/config';
import theme from '../constants/theme';
import AuroraBackground from '../components/AuroraBackground';
import ComboPill from '../components/ComboPill';
import LivesRow from '../components/LivesRow';
import OrbitArena from '../components/OrbitArena';
import PauseOverlay from '../components/PauseOverlay';
import RoundBanner from '../components/RoundBanner';
import ScreenHeader from '../components/ScreenHeader';
import {useOrbitEngine} from '../hooks/useOrbitEngine';
import {formatMultiplier} from '../game/orbit';
import type {RunResult} from '../game/stats';

interface Props {
  difficulty: DifficultyId;
  onGameOver: (r: RunResult) => void;
  onQuit: () => void;
}

/** G2 floating-controls arena. The round result is owned by App.tsx. */
function GameScreen({difficulty, onGameOver, onQuit}: Props) {
  const [paused, setPaused] = useState(false);
  const {view, tap} = useOrbitEngine(difficulty, onGameOver, paused);

  const enter = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    if (view.feedback !== 'miss') {
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 1,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -1,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 1,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shake, view.feedback]);

  const handlePressIn = useCallback(() => {
    Animated.spring(press, {
      toValue: 0.985,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [press]);

  const handlePressOut = useCallback(() => {
    Animated.spring(press, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [press]);

  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);

  const beatLabel = 'BEAT ' + String(view.beat + 1) + ' / ' + String(view.beats);

  return (
    <View style={styles.root}>
      <AuroraBackground variant="game">
        <View style={styles.layout}>
          <ScreenHeader
            title={'ROUND ' + String(view.round)}
            subtitle={beatLabel}
            leftSlot={
              <Pressable
                onPress={openPause}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                accessibilityRole="button"
                accessibilityLabel="PAUSE MISSION"
                style={styles.pauseBtn}>
                <Pause size={20} color={theme.colors.textDim} strokeWidth={2.2} />
              </Pressable>
            }
            rightSlot={
              <View style={styles.scoreBox}>
                <Text style={styles.scoreValue}>{String(view.score)}</Text>
                <Text style={styles.scoreCaption}>SCORE</Text>
              </View>
            }
          />

          <View style={styles.arena}>
            <Pressable
              onPress={tap}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              accessibilityRole="button"
              accessibilityLabel="ORBIT TAP AREA"
              style={styles.tapSurface}>
              <Animated.View
                pointerEvents="box-none"
                style={[
                  styles.arenaInner,
                  {
                    opacity: enter,
                    transform: [
                      {
                        scale: Animated.multiply(
                          press,
                          enter.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.94, 1],
                          }),
                        ),
                      },
                      {
                        translateX: shake.interpolate({
                          inputRange: [-1, 1],
                          outputRange: [-5, 5],
                        }),
                      },
                    ],
                  },
                ]}>
                <OrbitArena view={view} />
              </Animated.View>
            </Pressable>
            <RoundBanner text={view.banner} />
          </View>

          <View style={styles.controls} pointerEvents="box-none">
            <LivesRow lives={view.lives} />
            <ComboPill
              Icon={Zap}
              value={formatMultiplier(view.combo)}
              caption="COMBO"
              color={theme.colors.success}
            />
            <ComboPill
              Icon={Target}
              value={String(view.speed)}
              caption="SPEED"
              color={theme.colors.primary}
            />
          </View>
        </View>

        <PauseOverlay
          visible={paused}
          onResume={closePause}
          onQuit={onQuit}
        />
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
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,247,255,0.07)',
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
  },
  scoreBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: theme.colors.accent,
    fontVariant: ['tabular-nums'],
  },
  scoreCaption: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMute,
  },
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 130,
  },
  tapSurface: {
    width: ARENA,
    height: ARENA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arenaInner: {
    width: ARENA,
    height: ARENA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
    height: 84,
    borderRadius: theme.radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(20,27,61,0.90)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.secondary,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 8},
    elevation: 10,
  },
});

export default GameScreen;
