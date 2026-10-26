import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {PLANET_SIZE} from '../constants/config';

interface Props {
  source: number;
  x: number;
  y: number;
  size?: number;
  dim?: boolean;
}

/**
 * Transparent-background AI sprite placed straight over the arena. No round
 * masking wrapper — that old hack draws a visible bubble around the object.
 * Positioned with a transform so a move never triggers a layout pass.
 */
function PlanetSprite({source, x, y, size = PLANET_SIZE, dim}: Props) {
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[
        styles.sprite,
        {
          width: size,
          height: size,
          opacity: dim ? 0.55 : 1,
          transform: [{translateX: x - size / 2}, {translateY: y - size / 2}],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});

export default React.memo(PlanetSprite);
