import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

const ICON_SIZE = 22;

interface Props {
  Icon: React.ComponentType<any>;
  value: string;
  label: string;
  valueColor: string;
}

/**
 * One stat pill, identical on Menu and Result. Width comes from the parent
 * slot (`width: '100%'`), height from the content — never flex:1 inside a
 * flex:1 slot, which collapses the card and clips the text.
 */
function StatCard({Icon, value, label, valueColor}: Props) {
  return (
    <View style={[styles.card, {borderColor: valueColor + '55'}]}>
      <View style={[styles.iconWrap, {backgroundColor: valueColor + '22'}]}>
        <Icon size={ICON_SIZE} color={valueColor} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: 'rgba(28,37,80,0.72)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.textMute,
  },
});

export default React.memo(StatCard);
