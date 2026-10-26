import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text} from 'react-native';

import {ROUND_BANNER_MS} from '../constants/config';
import theme from '../constants/theme';

interface Props {
  text: string;
}

/** Finite centred banner. Only opacity/transform are animated. */
function RoundBanner({text}: Props) {
  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    appear.setValue(0);
    Animated.timing(appear, {
      toValue: 1,
      duration: Math.round(ROUND_BANNER_MS * 0.4),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear, text]);

  if (!text) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.banner,
        {
          opacity: appear,
          transform: [
            {
              scale: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [0.86, 1],
              }),
            },
          ],
        },
      ]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(20,27,61,0.94)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
});

export default React.memo(RoundBanner);
