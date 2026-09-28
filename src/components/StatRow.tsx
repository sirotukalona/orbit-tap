import React from 'react';
import {StyleSheet, View} from 'react-native';
import StatCard from './StatCard';

export interface StatItem {
  key: string;
  value: number;
  label: string;
  tint: string;
  Icon?: React.ComponentType<any>;
}

interface Props {
  items: StatItem[];
}

/**
 * Renders only the stats that actually carry a number. A lone pill looks
 * orphaned, so the whole row is dropped below two visible cards — never an
 * empty rounded box.
 */
export default function StatRow({items}: Props) {
  const visible = items.filter(i => i.value > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            value={String(item.value)}
            label={item.label}
            tint={item.tint}
            Icon={item.Icon}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 12, width: '100%'},
  slot: {flex: 1},
});
