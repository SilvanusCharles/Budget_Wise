import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FAQScreen } from '../screens/FAQScreen';
import { SettingsStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { getSlideRightScreenOptions } from './screenTransitions';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
        ...getSlideRightScreenOptions(),
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="FAQ" component={FAQScreen} options={{ title: 'FAQ' }} />
    </Stack.Navigator>
  );
}
