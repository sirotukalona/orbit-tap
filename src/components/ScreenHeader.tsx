import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C} from '../constants/theme';
import {HEADER_H} from '../constants/config';

interface Props {
  title: string;
  subtitle?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}

/** The single header used by every screen — no per-screen inline header markup. */
export default function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  transparent,
}: Props) {
  return (
    <View style={[styles.bar, transparent ? styles.ghost : styles.solid]}>
      <View style={styles.side}>{leftSlot ? leftSlot : null}</View>
      <View style={styles.middle}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? subtitle : null}
      </View>
      <View style={styles.sideRight}>{rightSlot ? rightSlot : null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: HEADER_H,
    paddingTop: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  solid: {
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  ghost: {backgroundColor: 'transparent'},
  side: {width: 104, alignItems: 'flex-start', justifyContent: 'center'},
  sideRight: {width: 104, alignItems: 'flex-end', justifyContent: 'center'},
  middle: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 3,
    color: C.text,
  },
});
