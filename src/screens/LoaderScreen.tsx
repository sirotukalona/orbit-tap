import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import AuroraBackground from '../components/AuroraBackground';
import LoaderGrain from '../components/LoaderGrain';
import {C, GRADIENTS} from '../constants/theme';
import {LOADER_DURATION_MS, LOADER_TICK_MS} from '../constants/config';
import {IMAGES} from '../assets';

interface Props {
  onReady: () => void;
}

const STEPS = Math.max(1, Math.round(LOADER_DURATION_MS / LOADER_TICK_MS));
const EMBLEM = 168;

export default function LoaderScreen({onReady}: Props) {
  const [step, setStep] = useState(0);
  const mark = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const turn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // One-shot entrance only. A perpetual loop would keep the window busy and
    // uiautomator would never settle on this screen.
    Animated.spring(mark, {
      toValue: 1,
      tension: 58,
      friction: 7,
      useNativeDriver: true,
    }).start();
    Animated.timing(word, {
      toValue: 1,
      duration: 450,
      delay: 220,
      useNativeDriver: true,
    }).start();
    Animated.timing(turn, {
      toValue: 1,
      duration: 2600,
      useNativeDriver: true,
    }).start();
  }, [mark, turn, word]);

  useEffect(() => {
    const tick = setInterval(() => {
      setStep(prev => (prev >= STEPS ? STEPS : prev + 1));
    }, LOADER_TICK_MS);
    const jump = setTimeout(onReady, LOADER_DURATION_MS);
    return () => {
      clearInterval(tick);
      clearTimeout(jump);
    };
  }, [onReady]);

  const pct = Math.min(100, Math.round((step / STEPS) * 100));
  const spin = turn.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AuroraBackground
      image={IMAGES.bgLoader}
      veil={GRADIENTS.loaderVeil}
      decor={<LoaderGrain />}
      style={styles.body}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.emblem,
          {
            opacity: mark,
            transform: [
              {scale: mark.interpolate({inputRange: [0, 1], outputRange: [0.82, 1]})},
            ],
          },
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.rings, {transform: [{rotate: spin}]}]}>
          <Svg width={EMBLEM} height={EMBLEM}>
            <Circle
              cx={EMBLEM / 2}
              cy={EMBLEM / 2}
              r={EMBLEM / 2 - 2}
              stroke={C.primary}
              strokeOpacity={0.8}
              strokeWidth={2}
              fill="none"
            />
            <Circle
              cx={EMBLEM / 2}
              cy={EMBLEM / 2}
              r={EMBLEM / 2 - 12}
              stroke={C.secondary}
              strokeOpacity={0.55}
              strokeWidth={2}
              strokeDasharray="6 12"
              fill="none"
            />
            <Circle
              cx={EMBLEM / 2}
              cy={EMBLEM / 2}
              r={EMBLEM / 2 - 22}
              stroke={C.accent}
              strokeOpacity={0.35}
              strokeWidth={2}
              fill="none"
            />
            <Circle cx={EMBLEM / 2} cy={4} r={5} fill={C.accent} />
          </Svg>
        </Animated.View>
        <View style={styles.brandCard}>
          <Image source={IMAGES.iconApp} style={styles.brandArt} resizeMode="cover" />
        </View>
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.words,
          {
            opacity: word,
            transform: [
              {translateY: word.interpolate({inputRange: [0, 1], outputRange: [16, 0]})},
            ],
          },
        ]}>
        <Text style={styles.brand}>ORBIT TAP</Text>
        <Text style={styles.tagline}>TAP THE BEAT · MISS NOTHING</Text>
      </Animated.View>

      <View style={styles.progressWrap}>
        <View style={styles.track}>
          <LinearGradient
            colors={GRADIENTS.progress}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.fill, {width: (pct + '%') as any}]}
          />
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  body: {alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26},
  emblem: {
    width: EMBLEM,
    height: EMBLEM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rings: {position: 'absolute', width: EMBLEM, height: EMBLEM},
  brandCard: {
    width: 108,
    height: 108,
    borderRadius: 54,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(245,247,255,0.22)',
    backgroundColor: C.surfaceDeep,
    shadowColor: C.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 26,
    elevation: 14,
  },
  brandArt: {width: 108, height: 108},
  words: {alignItems: 'center', marginTop: 34},
  brand: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: 6,
    color: C.text,
    textShadowColor: C.primary,
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 18,
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(245,247,255,0.55)',
  },
  progressWrap: {marginTop: 46, alignItems: 'center'},
  track: {
    width: 190,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  fill: {height: 4, borderRadius: 2},
  loading: {
    marginTop: 14,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 4,
    color: 'rgba(245,247,255,0.38)',
  },
});
