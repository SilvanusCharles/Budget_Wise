import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { HomeScreen } from '../screens/HomeScreen';
import { PresetsScreen } from '../screens/PresetsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsNavigator } from './SettingsNavigator';
import { RootTabParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { getFadeScreenOptions } from './screenTransitions';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Presets: 'layers',
            Profile: 'person',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        // Smooth fade transition between tabs
        // Note: Bottom tabs do not support custom card interpolators in the same way as stacks.
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Budget Vibes',
        }}
      />
      <Tab.Screen
        name="Presets"
        component={PresetsScreen}
        options={{
          title: 'Presets',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{ headerShown: false, title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
