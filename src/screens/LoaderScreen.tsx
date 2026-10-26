import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';

import {
  LOADER_BAR_ANIM_MS,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
} from '../constants/config';
import theme from '../constants/theme';
import AuroraBackground from '../components/AuroraBackground';

const RING = 168;
const DOT = 16;
const BAR_W = 190;
const SPIN_MS = 2200;

interface Props {
  onDone: () => void;
}

/**
 * Brand card. Non-interactive by design — the hand-off to the menu is a
 * timer, and every animation here is finite so the window settles early.
 */
function LoaderScreen({onDone}: Props) {
  const ring = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(ring, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.back(1.4)),
      useNativeDriver: true,
    }).start();

    Animated.timing(title, {
      toValue: 1,
      delay: 420,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: SPIN_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {iterations: 2},
    ).start();

    Animated.timing(bar, {
      toValue: BAR_W,
      delay: 300,
      duration: LOADER_BAR_ANIM_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [bar, ring, spin, title]);

  useEffect(() => {
    const swap = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);
    return () => clearTimeout(swap);
  }, [fade, onDone]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.root, {opacity: fade}]}>
      <AuroraBackground variant="loader">
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.ringWrap,
              {
                opacity: ring,
                transform: [
                  {
                    scale: ring.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.72, 1],
                    }),
                  },
                ],
              },
            ]}>
            <Svg width={RING} height={RING}>
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING / 2 - 6}
                stroke={theme.colors.primary}
                strokeOpacity={0.5}
                strokeWidth={2}
                fill="none"
              />
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RING / 2 - 28}
                stroke={theme.colors.secondary}
                strokeOpacity={0.22}
                strokeWidth={1}
                strokeDasharray="3 9"
                fill="none"
              />
            </Svg>
            <Animated.View
              style={[styles.orbit, {transform: [{rotate}]}]}
              pointerEvents="none">
              <View style={styles.dot} />
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.brand,
              {
                opacity: title,
                transform: [
                  {
                    translateY: title.interpolate({
                      inputRange: [0, 1],
                      outputRange: [18, 0],
                    }),
                  },
                ],
              },
            ]}>
            <Text style={styles.wordmark}>ORBITTAP</Text>
            <Text style={styles.tagline}>TAP THE RHYTHM OF THE COSMOS</Text>
          </Animated.View>

          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, {width: bar}]}>
              <LinearGradient
                colors={theme.gradients.bar}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.barGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.caption}>LOADING...</Text>
        </View>
      </AuroraBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgDeep,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: RING,
    height: RING,
    alignItems: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    marginTop: 6 - DOT / 2,
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 0},
    elevation: 6,
  },
  brand: {
    marginTop: 38,
    alignItems: 'center',
  },
  wordmark: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 6,
    color: theme.colors.text,
    textShadowColor: 'rgba(91,140,255,0.75)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 18,
  },
  tagline: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.6,
    color: theme.colors.textMute,
  },
  barTrack: {
    marginTop: 46,
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(245,247,255,0.10)',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barGradient: {
    width: BAR_W,
    height: 4,
  },
  caption: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.textMute,
  },
});

export default LoaderScreen;
