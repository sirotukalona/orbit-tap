/**
 * OrbitTap — SPACE_COSMOS preset, AURORA / GRADIENT_MESH surface style.
 * Deep-space navy base, neon-blue primary, plasma-pink accent.
 */
export const theme = {
  name: 'SPACE_COSMOS',
  bg: '#0B1026',
  surface: '#101836',
  surfaceAlt: '#16204A',
  surfaceDeep: '#070C1E',
  primary: '#5B8CFF',
  secondary: '#7C4DFF',
  accent: '#FF6B9A',
  text: '#F5F7FF',
  textMuted: 'rgba(245,247,255,0.62)',
  textFaint: 'rgba(245,247,255,0.38)',
  border: 'rgba(91,140,255,0.22)',
  glass: 'rgba(255,255,255,0.06)',
  glassLine: 'rgba(255,255,255,0.10)',
  success: '#4BE3B0',
  danger: '#FF4D6D',
} as const;

export const C = theme;

export const GRADIENTS: {[k: string]: string[]} = {
  primary: ['#5B8CFF', '#7C4DFF'],
  action: ['#FF6B9A', '#7C4DFF'],
  progress: ['#5B8CFF', '#FF6B9A'],
  planet: ['#7C4DFF', '#5B8CFF'],
  loaderVeil: ['rgba(5,8,22,0.82)', 'rgba(5,8,22,0.94)'],
  menuVeil: ['rgba(11,16,38,0.10)', 'rgba(11,16,38,0.92)'],
  gameVeil: ['rgba(11,16,38,0.58)', 'rgba(7,12,30,0.86)'],
  resultVeil: ['rgba(5,8,22,0.80)', 'rgba(5,8,22,0.92)'],
  sheetGlow: ['rgba(91,140,255,0)', 'rgba(91,140,255,0.85)', 'rgba(91,140,255,0)'],
};

export const TYPE = {
  hero: {fontSize: 42, lineHeight: 48, fontWeight: '900' as const, letterSpacing: 6},
  title: {fontSize: 24, lineHeight: 28, fontWeight: '800' as const, letterSpacing: 2},
  body: {fontSize: 15, lineHeight: 20, fontWeight: '600' as const, letterSpacing: 0.2},
  caption: {fontSize: 11, lineHeight: 14, fontWeight: '700' as const, letterSpacing: 2.4},
};
