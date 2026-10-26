/**
 * Visual preset: SPACE_COSMOS (design-system/presets.ts), accent hexes
 * overridden to the brief's nebula palette. The `name` field is kept verbatim.
 * No `as const` — gradient arrays must stay mutable string[] for LinearGradient.
 */
export const theme = {
  name: 'space-cosmos',

  colors: {
    bg: '#0B1026',
    bgDeep: '#05070F',
    surfaceDeep: '#0A1628',
    surface: '#141B3D',
    surfaceAlt: '#1C2550',
    primary: '#5B8CFF',
    secondary: '#7C4DFF',
    accent: '#FF6B9A',
    success: '#4DE8C2',
    danger: '#FF4D6D',
    text: '#F5F7FF',
    textDim: '#A8B2D8',
    textMute: '#6B76A3',
    border: 'rgba(245,247,255,0.12)',
    borderSoft: 'rgba(245,247,255,0.08)',
    glass: 'rgba(245,247,255,0.06)',
    glassStrong: 'rgba(245,247,255,0.10)',
    ringTrack: 'rgba(245,247,255,0.10)',
  },

  gradients: {
    loader: ['#05070F', '#0B1026', '#0A1628'] as string[],
    result: ['#0B1026', '#16103A', '#0A1628'] as string[],
    cta: ['#5B8CFF', '#7C4DFF'] as string[],
    bar: ['#5B8CFF', '#7C4DFF', '#FF6B9A'] as string[],
    sheetFade: ['rgba(11,16,38,0)', 'rgba(11,16,38,0.55)', '#0B1026'] as string[],
  },

  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
  },

  type: {
    hero: 56,
    title: 32,
    section: 20,
    body: 16,
    caption: 11,
  },
};

export type Theme = typeof theme;
export default theme;
