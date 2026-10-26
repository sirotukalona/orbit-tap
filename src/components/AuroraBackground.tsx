import React, {useMemo} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';

import {SCREEN_H, SCREEN_W} from '../constants/config';
import theme from '../constants/theme';
import {buildStars} from '../utils/seededRandom';
import images from '../assets';

export type AuroraVariant = 'loader' | 'menu' | 'game' | 'result';

interface Blob {
  size: number;
  top: number;
  left: number;
  color: string;
}

interface Props {
  variant: AuroraVariant;
  children?: React.ReactNode;
}

const BLOBS: Record<AuroraVariant, Blob[]> = {
  loader: [
    {size: 300, top: SCREEN_H * 0.26, left: SCREEN_W * 0.5 - 150, color: 'rgba(91,140,255,0.16)'},
    {size: 240, top: SCREEN_H * 0.62, left: -70, color: 'rgba(124,77,255,0.12)'},
  ],
  menu: [
    {size: 280, top: -60, left: SCREEN_W - 190, color: 'rgba(255,107,154,0.14)'},
  ],
  game: [
    {size: 260, top: SCREEN_H * 0.14, left: -80, color: 'rgba(91,140,255,0.12)'},
  ],
  result: [
    {size: 300, top: -70, left: SCREEN_W - 200, color: 'rgba(255,107,154,0.18)'},
    {size: 280, top: SCREEN_H * 0.6, left: -90, color: 'rgba(91,140,255,0.16)'},
  ],
};

const STAR_COUNT: Record<AuroraVariant, number> = {
  loader: 220,
  menu: 54,
  game: 38,
  result: 130,
};

/**
 * Shared background layer: gradient or AI render, aurora blobs and a seeded
 * star field. Three depth layers on every screen, never a flat fill.
 */
function AuroraBackground({variant, children}: Props) {
  const stars = useMemo(
    () =>
      buildStars(
        STAR_COUNT[variant],
        SCREEN_W,
        SCREEN_H,
        variant === 'loader' ? 1337 : 4242,
        variant === 'loader' || variant === 'result',
      ),
    [variant],
  );

  const blobs = BLOBS[variant];

  const decor = (
    <>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_W} height={SCREEN_H}>
          {stars.map((s, i) => (
            <Circle
              key={'s' + i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={s.c}
              opacity={s.o}
            />
          ))}
        </Svg>
      </View>
      {blobs.map((b, i) => (
        <View
          key={'b' + i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: b.size,
            height: b.size,
            borderRadius: b.size / 2,
            top: b.top,
            left: b.left,
            backgroundColor: b.color,
          }}
        />
      ))}
    </>
  );

  if (variant === 'menu' || variant === 'game') {
    const source = variant === 'menu' ? images.bgMenu : images.bgGame;
    return (
      <ImageBackground
        source={source}
        resizeMode="cover"
        style={styles.fill}
        imageStyle={styles.image}>
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                variant === 'game'
                  ? 'rgba(11,16,38,0.55)'
                  : 'rgba(11,16,38,0.22)',
            },
          ]}
        />
        {decor}
        {children}
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={variant === 'loader' ? theme.gradients.loader : theme.gradients.result}
      start={{x: 0.1, y: 0}}
      end={{x: 0.9, y: 1}}
      style={styles.fill}>
      {decor}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  image: {
    backgroundColor: theme.colors.bg,
  },
});

export default React.memo(AuroraBackground);
