import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { OnboardingWelcomeScreen } from '../screens/onboarding/OnboardingWelcomeScreen';
import { OnboardingIncomeScreen } from '../screens/onboarding/OnboardingIncomeScreen';
import { OnboardingLifestyleScreen } from '../screens/onboarding/OnboardingLifestyleScreen';
import { OnboardingSavingsScreen } from '../screens/onboarding/OnboardingSavingsScreen';
import { OnboardingFamilyScreen } from '../screens/onboarding/OnboardingFamilyScreen';
import { OnboardingCurrencyScreen } from '../screens/onboarding/OnboardingCurrencyScreen';
import { OnboardingPhotoScreen } from '../screens/onboarding/OnboardingPhotoScreen';
import { OnboardingSuccessScreen } from '../screens/onboarding/OnboardingSuccessScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={OnboardingWelcomeScreen} />
      <Stack.Screen name="Income" component={OnboardingIncomeScreen} />
      <Stack.Screen name="Lifestyle" component={OnboardingLifestyleScreen} />
      <Stack.Screen name="Savings" component={OnboardingSavingsScreen} />
      <Stack.Screen name="Family" component={OnboardingFamilyScreen} />
      <Stack.Screen name="Currency" component={OnboardingCurrencyScreen} />
      <Stack.Screen name="Photo" component={OnboardingPhotoScreen} />
      <Stack.Screen
        name="Success"
        component={OnboardingSuccessScreen}
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
