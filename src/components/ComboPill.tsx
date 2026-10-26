import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

interface Props {
  Icon: React.ComponentType<any>;
  value: string;
  caption: string;
  color: string;
}

/** One floating read-out in the game control bar. */
function ComboPill({Icon, value, caption, color}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Icon size={18} color={color} strokeWidth={2.4} />
        <Text style={[styles.value, {color}]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 24,
  },
  value: {
    lineHeight: 18,
    fontSize: 17,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  caption: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMute,
  },
});

export default React.memo(ComboPill);
