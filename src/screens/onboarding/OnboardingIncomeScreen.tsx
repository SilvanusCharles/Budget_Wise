import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingOption, OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { INCOME_RANGE_OPTIONS } from '../../constants/onboarding';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { IncomeRange } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Income'>;

const SURVEY_STEPS = 7;
const SLIDER_VALUES: IncomeRange[] = ['under-30k', '30k-60k', '60k-100k', '100k-plus'];

export function OnboardingIncomeScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setIncomeRange } = useOnboarding();
  const { colors } = useTheme();
  const { scaled } = useAccessibility();

  const sliderIndex = Math.max(0, SLIDER_VALUES.indexOf(draft.incomeRange));

  return (
    <OnboardingShell
      step={2}
      totalSteps={SURVEY_STEPS}
      title="What's your income range?"
      subtitle="Drag the range or tap an option below."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      onNext={() => navigation.navigate('Lifestyle')}
    >
      <View style={styles.sliderBlock}>
        <Text style={[styles.selectedLabel, { color: colors.primary, fontSize: scaled(18) }]}>
          {INCOME_RANGE_OPTIONS.find((o) => o.value === draft.incomeRange)?.label}
        </Text>
        <Text style={{ color: colors.muted, fontSize: scaled(13), marginBottom: 16 }}>
          {INCOME_RANGE_OPTIONS.find((o) => o.value === draft.incomeRange)?.hint}
        </Text>

        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.trackFill,
              {
                width: `${((sliderIndex + 1) / SLIDER_VALUES.length) * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
        <View style={styles.tickRow}>
          {SLIDER_VALUES.map((value, index) => (
            <View
              key={value}
              style={[
                styles.tick,
                {
                  backgroundColor: index <= sliderIndex ? colors.primary : colors.border,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {INCOME_RANGE_OPTIONS.map((option) => (
        <OnboardingOption
          key={option.value}
          label={option.label}
          hint={option.hint}
          selected={draft.incomeRange === option.value}
          onPress={() => setIncomeRange(option.value)}
        />
      ))}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  sliderBlock: { marginBottom: 8 },
  selectedLabel: { fontWeight: '800', marginBottom: 4 },
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  trackFill: { height: '100%', borderRadius: 999 },
  tickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tick: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
});
