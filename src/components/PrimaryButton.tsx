import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {C, GRADIENTS} from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  colors?: string[];
  glow?: string;
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

/**
 * Pressable is the PARENT and owns every touch; the animated layer lives
 * inside it and is marked box-none, so the scale transform can never swallow
 * onPress on an Android release build.
 */
export default function PrimaryButton({label, onPress, Icon, colors, glow}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      tension: 180,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const up = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 180,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Pressable
      style={[styles.press, {shadowColor: glow || C.primary}]}
      onPress={onPress}
      onPressIn={down}
      onPressOut={up}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.skin, {transform: [{scale}]}]}>
        <LinearGradient
          colors={colors || GRADIENTS.primary}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={StyleSheet.absoluteFill}
        />
        <View pointerEvents="none" style={styles.gloss} />
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={C.text} strokeWidth={2.4} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  skin: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: C.text,
  },
});
