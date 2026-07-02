import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { TabNavigator } from './TabNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Palette, DarkPalette } from '../constants/colors';

export function AppNavigator() {
  const { isDark, colors } = useTheme();
  const { onboardingCompleted } = useApp();
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      {onboardingCompleted ? <TabNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
