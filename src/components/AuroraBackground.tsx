import React from 'react';
import {ImageBackground, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {C} from '../constants/theme';

interface Props {
  image: any;
  veil: string[];
  decor?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * AURORA / GRADIENT_MESH surface: AI backdrop, a gradient veil that sets the
 * screen's mood, then two soft colour blooms so no screen ever reads flat.
 */
export default function AuroraBackground({image, veil, decor, style, children}: Props) {
  return (
    <ImageBackground source={image} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={veil}
        start={{x: 0.1, y: 0}}
        end={{x: 0.9, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.bloom, styles.bloomA]} />
      <View pointerEvents="none" style={[styles.bloom, styles.bloomB]} />
      {decor ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {decor}
        </View>
      ) : null}
      <View style={[styles.content, style]}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bg},
  content: {flex: 1},
  bloom: {position: 'absolute', borderRadius: 260},
  bloomA: {
    width: 340,
    height: 340,
    top: -90,
    left: -110,
    backgroundColor: 'rgba(91,140,255,0.18)',
  },
  bloomB: {
    width: 300,
    height: 300,
    bottom: -60,
    right: -100,
    backgroundColor: 'rgba(124,77,255,0.16)',
  },
});
