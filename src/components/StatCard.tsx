import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C} from '../constants/theme';

interface Props {
  value: string;
  label: string;
  tint: string;
  Icon?: React.ComponentType<any>;
}

/**
 * One stat pill shape, reused on Menu and on the result screen so the two
 * never drift apart. width:'100%' (never flex:1) because the parent slot is
 * already flex:1 — nesting two flex:1 collapses this card's height.
 */
export default function StatCard({value, label, tint, Icon}: Props) {
  return (
    <View style={[styles.card, {borderColor: tint + '55'}]}>
      <View style={[styles.iconWrap, {backgroundColor: tint + '22'}]}>
        {Icon ? (
          <Icon size={22} color={tint} strokeWidth={2.4} />
        ) : (
          <View style={[styles.dot, {backgroundColor: tint}]} />
        )}
      </View>
      <Text style={[styles.value, {color: tint}]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {width: 8, height: 8, borderRadius: 4},
  value: {fontSize: 22, lineHeight: 26, fontWeight: '900', letterSpacing: 0.5},
  label: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: C.textFaint,
  },
});
