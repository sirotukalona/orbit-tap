import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {START_LIVES} from '../constants/config';
import theme from '../constants/theme';

interface Props {
  lives: number;
  max?: number;
}

/** Three life squares, filled while alive. */
function LivesRow({lives, max = START_LIVES}: Props) {
  const slots: number[] = [];
  for (let i = 0; i < max; i++) {
    slots.push(i);
  }
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {slots.map(i => (
          <View
            key={'life' + i}
            style={[styles.cell, i < lives ? styles.alive : styles.spent]}
          />
        ))}
      </View>
      <Text style={styles.caption}>LIVES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center', justifyContent: 'center'},
  row: {flexDirection: 'row', gap: 6, height: 24, alignItems: 'center'},
  cell: {width: 14, height: 14, borderRadius: 4},
  alive: {backgroundColor: theme.colors.accent},
  spent: {backgroundColor: 'rgba(245,247,255,0.12)'},
  caption: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textMute,
  },
});

export default React.memo(LivesRow);
