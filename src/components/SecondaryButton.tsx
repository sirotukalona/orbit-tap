import React, {useCallback, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {C} from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  tone?: 'glass' | 'ghost';
}

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const ICON = 24;

export default function SecondaryButton({label, onPress, Icon, tone}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const down = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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
      style={styles.press}
      onPress={onPress}
      onPressIn={down}
      onPressOut={up}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.skin,
          tone === 'ghost' ? styles.ghost : styles.glass,
          {transform: [{scale}]},
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={C.text} strokeWidth={2.2} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {width: '100%', height: 48},
  skin: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glass: {
    backgroundColor: C.glass,
    borderWidth: 1,
    borderColor: C.glassLine,
  },
  ghost: {backgroundColor: 'transparent'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: C.textMuted,
  },
});
