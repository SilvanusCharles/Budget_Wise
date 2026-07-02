import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingOption, OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { SAVINGS_GOAL_OPTIONS } from '../../constants/onboarding';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Savings'>;

const SURVEY_STEPS = 7;

export function OnboardingSavingsScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setSavingsGoal } = useOnboarding();

  return (
    <OnboardingShell
      step={4}
      totalSteps={SURVEY_STEPS}
      title="What's your savings goal?"
      subtitle="Pick the priority that matters most right now."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      onNext={() => navigation.navigate('Family')}
    >
      {SAVINGS_GOAL_OPTIONS.map((option) => (
        <OnboardingOption
          key={option.value}
          label={option.label}
          hint={option.description}
          selected={draft.savingsGoal === option.value}
          onPress={() => setSavingsGoal(option.value)}
        />
      ))}
    </OnboardingShell>
  );
}
