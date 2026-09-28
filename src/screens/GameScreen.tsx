import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft, Pause} from 'lucide-react-native';
import AuroraBackground from '../components/AuroraBackground';
import ScreenHeader from '../components/ScreenHeader';
import OrbitArena from '../components/OrbitArena';
import LivesDots from '../components/LivesDots';
import PauseOverlay from '../components/PauseOverlay';
import {C, GRADIENTS} from '../constants/theme';
import {
  DOCK_BOTTOM,
  DOCK_H,
  DOCK_RESERVE,
  HINT_MS,
  ROUND_BEATS,
} from '../constants/config';
import {IMAGES} from '../assets';
import {useOrbitEngine} from '../hooks/useOrbitEngine';
import {SessionResult} from '../game/scoring';
import {profile} from '../game/store';

interface Props {
  startRound: number;
  onGameOver: (result: SessionResult) => void;
  onExit: () => void;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

export default function GameScreen({startRound, onGameOver, onExit}: Props) {
  const game = useOrbitEngine(startRound, onGameOver);
  const [hintOn, setHintOn] = useState(true);
  const pop = useRef(new Animated.Value(0)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => setHintOn(false), HINT_MS);
    return () => clearTimeout(t);
  }, []);

  const floaterId = game.floater ? game.floater.id : 0;
  useEffect(() => {
    if (!floaterId) {
      return;
    }
    pop.setValue(0);
    Animated.timing(pop, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [floaterId, pop]);

  const down = useCallback(() => {
    Animated.spring(tapScale, {
      toValue: 0.93,
      tension: 200,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [tapScale]);

  const up = useCallback(() => {
    Animated.spring(tapScale, {
      toValue: 1,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [tapScale]);

  const best = profile.best();
  const progress = Math.round((game.beatsDone / ROUND_BEATS) * 100);

  return (
    <AuroraBackground image={IMAGES.bgGame} veil={GRADIENTS.gameVeil}>
      <ScreenHeader title={'ROUND ' + (game.round + 1)}
        subtitle={
          <View style={styles.roundTrack}>
            <View style={[styles.roundFill, {width: (progress + '%') as any}]} />
          </View>
        }
        leftSlot={
          <Pressable
            style={styles.iconBtn}
            onPress={onExit}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Back to menu">
            <ArrowLeft size={24} color={C.text} strokeWidth={2.4} />
          </Pressable>
        }
        rightSlot={
          <View style={styles.headRight}>
            <LivesDots lives={game.lives} />
            <Pressable
              style={styles.iconBtnSmall}
              onPress={game.pause}
              hitSlop={HIT}
              accessibilityRole="button"
              accessibilityLabel="Pause">
              <Pause size={20} color={C.textMuted} strokeWidth={2.4} />
            </Pressable>
          </View>
        }
      />

      <Pressable
        style={styles.tapZone}
        onPress={game.tap}
        accessibilityRole="button"
        accessibilityLabel="Tap the orbit">
        <OrbitArena
          spin={game.spin}
          shake={game.shake}
          flash={game.flash}
          dir={game.dir}
          arcStart={game.arcStart}
          arcDeg={game.arcDeg}
          beatOn={game.beatOn}
          combo={game.combo}
        />
        {game.floater ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floater,
              {
                opacity: pop.interpolate({
                  inputRange: [0, 0.2, 1],
                  outputRange: [0, 1, 0],
                }),
                transform: [
                  {translateY: pop.interpolate({inputRange: [0, 1], outputRange: [0, -46]})},
                ],
              },
            ]}>
            <Text style={styles.floaterText}>{game.floater.text}</Text>
          </Animated.View>
        ) : null}
        {hintOn ? (
          <View pointerEvents="none" style={styles.hint}>
            <Text style={styles.hintText}>WAIT FOR THE GLOW</Text>
          </View>
        ) : null}
      </Pressable>

      <View style={styles.dock}>
        <View style={styles.dockStats}>
          <Text style={styles.dockValue}>{game.score}</Text>
          <Text style={styles.dockLabel}>SCORE</Text>
          <Text style={styles.dockBest}>{'BEST ' + best}</Text>
        </View>
        <Pressable
          style={styles.tapBtn}
          onPress={game.tap}
          onPressIn={down}
          onPressOut={up}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="TAP">
          <Animated.View
            pointerEvents="box-none"
            style={[styles.tapSkin, {transform: [{scale: tapScale}]}]}>
            <LinearGradient
              colors={GRADIENTS.action}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.tapFill}>
              <Text style={styles.tapText}>TAP</Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </View>

      {game.paused ? (
        <PauseOverlay onResume={game.resume} onQuit={game.quit} />
      ) : null}
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  roundTrack: {
    marginTop: 6,
    width: 92,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  roundFill: {height: 3, borderRadius: 2, backgroundColor: C.primary},
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.glass,
    borderWidth: 1,
    borderColor: C.glassLine,
  },
  iconBtnSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.glass,
    borderWidth: 1,
    borderColor: C.glassLine,
  },
  headRight: {flexDirection: 'row', alignItems: 'center', gap: 8},
  tapZone: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: DOCK_RESERVE,
  },
  floater: {position: 'absolute', top: 40, alignSelf: 'center'},
  floaterText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: C.success,
    textShadowColor: 'rgba(75,227,176,0.7)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 12,
  },
  hint: {position: 'absolute', bottom: DOCK_RESERVE - 18, alignSelf: 'center'},
  hintText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2.6,
    color: 'rgba(245,247,255,0.5)',
  },
  dock: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: DOCK_BOTTOM,
    height: DOCK_H,
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12,18,44,0.82)',
    borderWidth: 1,
    borderColor: C.border,
  },
  dockStats: {justifyContent: 'center'},
  dockValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    color: C.text,
    letterSpacing: 0.5,
  },
  dockLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: C.textFaint,
  },
  dockBest: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: C.primary,
  },
  tapBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    shadowColor: C.accent,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
  },
  tapSkin: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  tapFill: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 3,
    color: C.text,
  },
});
