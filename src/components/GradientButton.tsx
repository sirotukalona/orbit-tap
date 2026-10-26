import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

const ICON_SIZE = 24;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: React.ComponentType<any>;
  variant?: 'primary' | 'secondary';
}

/**
 * Press feedback pattern for this stack: Pressable is the PARENT and owns
 * onPressIn/onPressOut, the Animated.View carrying the native-driven scale
 * is its CHILD. Icon is a fixed 24x24 square, label lineHeight matches it.
 */
function GradientButton({label, onPress, Icon, variant = 'primary'}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  const isPrimary = variant === 'primary';

  const content = (
    <View style={styles.row}>
      {Icon ? (
        <Icon
          size={ICON_SIZE}
          color={isPrimary ? theme.colors.text : theme.colors.textDim}
          strokeWidth={2.2}
        />
      ) : null}
      <Text style={isPrimary ? styles.labelPrimary : styles.labelSecondary}>
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={isPrimary ? styles.pressPrimary : styles.pressSecondary}>
      <Animated.View
        style={[
          isPrimary ? styles.shapePrimary : styles.shapeSecondary,
          {transform: [{scale}]},
        ]}>
        {isPrimary ? (
          <LinearGradient
            colors={theme.gradients.cta}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}>
            {content}
          </LinearGradient>
        ) : (
          content
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressPrimary: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 10,
  },
  pressSecondary: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
  },
  shapePrimary: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  shapeSecondary: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(245,247,255,0.07)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  labelPrimary: {
    lineHeight: ICON_SIZE,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  labelSecondary: {
    lineHeight: ICON_SIZE,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textDim,
  },
});

export default React.memo(GradientButton);
