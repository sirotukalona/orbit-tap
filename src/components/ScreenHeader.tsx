import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import theme from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  transparent?: boolean;
}

/**
 * The one header used across every screen. Keeping it shared is what stops
 * badge / padding drift between Menu, Game and Result.
 */
function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  transparent,
}: Props) {
  return (
    <View style={[styles.header, transparent ? styles.transparent : null]}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.sideRight}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 18,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10,22,40,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassStrong,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  side: {
    width: 104,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 104,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textMute,
  },
});

export default React.memo(ScreenHeader);
