import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {C} from '../constants/theme';

interface Props {
  title: string;
  caption: string;
  tint: string;
}

/**
 * The decorative rings sit in their own row ABOVE the heading box, never
 * across the glyphs — a stroke through an "L" reads as a typo.
 */
export default function ResultBadge({title, caption, tint}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.decor}>
        <Svg width={120} height={40}>
          <Circle cx={60} cy={20} r={18} stroke={tint} strokeWidth={2} fill="none" opacity={0.8} />
          <Circle cx={60} cy={20} r={10} stroke={C.primary} strokeWidth={1.5} fill="none" opacity={0.6} />
          <Circle cx={18} cy={20} r={3} fill={tint} opacity={0.7} />
          <Circle cx={102} cy={20} r={3} fill={C.secondary} opacity={0.7} />
        </Svg>
      </View>
      <Text style={[styles.title, {color: tint, textShadowColor: tint}]}>{title}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'center'},
  decor: {marginBottom: 10},
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 18,
  },
  caption: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2.6,
    color: C.textFaint,
  },
});
