import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {DIFFICULTIES, type DifficultyId} from '../constants/config';
import theme from '../constants/theme';

interface ChipProps {
  id: DifficultyId;
  active: boolean;
  onChange: (id: DifficultyId) => void;
}

function Chip({id, active, onChange}: ChipProps) {
  const handlePress = useCallback(() => onChange(id), [id, onChange]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      accessibilityRole="button"
      accessibilityLabel={'MISSION LEVEL ' + id}
      accessibilityState={{selected: active}}
      style={[styles.chip, active ? styles.chipActive : null]}>
      <View style={styles.chipInner}>
        <View
          style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
        />
        <Text style={[styles.label, active ? styles.labelActive : null]}>
          {id}
        </Text>
      </View>
    </Pressable>
  );
}

interface Props {
  value: DifficultyId;
  onChange: (id: DifficultyId) => void;
}

/** Mission-level selector. Deliberately free of any launch-verb label. */
function DifficultyChips({value, onChange}: Props) {
  return (
    <View style={styles.row}>
      {DIFFICULTIES.map(d => (
        <Chip
          key={d.id}
          id={d.id}
          active={d.id === value}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.glassStrong,
  },
  chipActive: {
    backgroundColor: 'rgba(91,140,255,0.18)',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  chipInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.accent,
  },
  dotIdle: {
    backgroundColor: 'rgba(245,247,255,0.18)',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.textDim,
  },
  labelActive: {
    color: theme.colors.text,
  },
});

export default React.memo(DifficultyChips);
