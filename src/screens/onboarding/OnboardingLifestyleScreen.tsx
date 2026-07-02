import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { LIFESTYLE_OPTIONS } from '../../constants/onboarding';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Lifestyle'>;

const SURVEY_STEPS = 7;

export function OnboardingLifestyleScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setLifestyle } = useOnboarding();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  return (
    <OnboardingShell
      step={3}
      totalSteps={SURVEY_STEPS}
      title="Which lifestyle fits you?"
      subtitle="We'll tune preset suggestions to how you live."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      onNext={() => navigation.navigate('Savings')}
    >
      <View style={styles.grid}>
        {LIFESTYLE_OPTIONS.map((option) => {
          const selected = draft.lifestyle === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setLifestyle(option.value)}
              style={[
                styles.tile,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? `${colors.primary}16` : colors.background,
                },
              ]}
              accessibilityState={{ selected }}
              {...buttonA11y(option.label)}
            >
              <Ionicons
                name={option.icon as keyof typeof Ionicons.glyphMap}
                size={scaled(28)}
                color={selected ? colors.primary : colors.muted}
              />
              <Text
                style={[
                  styles.tileLabel,
                  { color: colors.text, fontSize: scaled(15) },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  tile: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  tileLabel: { fontWeight: '700' },
});
