import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text} from 'react-native';

import theme from '../constants/theme';

interface Props {
  value: number;
  duration?: number;
}

/** Tabular-nums count-up. Finite tween, settles and leaves the window idle. */
function ScoreCounter({value, duration = 900}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({value: v}) => {
      setShown(Math.round(v));
    });
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: value,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setShown(value));
    return () => {
      anim.removeListener(id);
      anim.stopAnimation();
    };
  }, [anim, duration, value]);

  return <Text style={styles.score}>{String(shown)}</Text>;
}

const styles = StyleSheet.create({
  score: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.accent,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(255,107,154,0.45)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 18,
  },
});

export default React.memo(ScoreCounter);
