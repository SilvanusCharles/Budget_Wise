export const Palette = {
  primary: '#7286A0',
  secondary: '#7D6F86',
  background: '#FFF4E9',
  accent: '#F9564F',
  text: '#0A0908',
  white: '#FFFFFF',
  border: '#E8DDD0',
  muted: '#6B6560',
} as const;

export const DarkPalette = {
  primary: '#8FA3BC',
  secondary: '#9A8DA3',
  background: '#1A1816',
  accent: '#F9564F',
  text: '#FFF4E9',
  white: '#2A2724',
  border: '#3D3834',
  muted: '#A39E98',
} as const;

export function getCardShadow(isDark: boolean) {
  return {
    shadowColor: isDark ? '#000000' : '#7286A0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.35 : 0.14,
    shadowRadius: 14,
    elevation: 5,
  };
}

export const ChartColors = [
  Palette.primary,
  Palette.secondary,
  Palette.accent,
  '#A8C5A0',
  '#E8B86D',
  '#C9A0DC',
  '#6ECEDA',
  '#F4A261',
] as const;
