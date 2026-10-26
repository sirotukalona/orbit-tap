/** Re-export of the AI-generated PNGs (assets/ at project root). */
export const images = {
  bgMenu: require('../../assets/bg_game.png'),
  bgGame: require('../../assets/bg_game.png'),
  planetBlue: require('../../assets/sprite_1.png'),
  planetPink: require('../../assets/sprite_2.png'),
  planetViolet: require('../../assets/sprite_3.png'),
  comet: require('../../assets/sprite_4.png'),
};

/** Ring index -> planet sprite. */
export const PLANET_SPRITES = [
  images.planetBlue,
  images.planetViolet,
  images.planetPink,
];

export default images;
