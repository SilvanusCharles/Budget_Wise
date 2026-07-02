import React, { createContext, useContext, useMemo } from 'react';
import { DarkPalette, Palette } from '../constants/colors';
import { useApp } from './AppContext';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  accent: string;
  text: string;
  white: string;
  border: string;
  muted: string;
}

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  largerText: boolean;
  fontScale: number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useApp();

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: settings.darkMode ? DarkPalette : Palette,
      isDark: settings.darkMode,
      largerText: settings.largerText,
      fontScale: settings.largerText ? 1.25 : 1,
    }),
    [settings.darkMode, settings.largerText],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
