import { IncomeRange, Lifestyle, OnboardingData, SavingsGoal } from '../types';

export const INCOME_RANGE_OPTIONS: { value: IncomeRange; label: string; hint: string }[] = [
  { value: 'under-30k', label: 'Under $30k', hint: 'Starting out or part-time' },
  { value: '30k-60k', label: '$30k – $60k', hint: 'Steady income' },
  { value: '60k-100k', label: '$60k – $100k', hint: 'Comfortable range' },
  { value: '100k-plus', label: '$100k+', hint: 'Higher earnings' },
];

export const LIFESTYLE_OPTIONS: { value: Lifestyle; label: string; icon: string }[] = [
  { value: 'student', label: 'Student', icon: 'school-outline' },
  { value: 'professional', label: 'Professional', icon: 'briefcase-outline' },
  { value: 'family', label: 'Family', icon: 'people-outline' },
  { value: 'retiree', label: 'Retiree', icon: 'sunny-outline' },
];

export const SAVINGS_GOAL_OPTIONS: { value: SavingsGoal; label: string; description: string }[] = [
  { value: 'short-term', label: 'Short-term', description: 'Vacation, gadgets, events' },
  { value: 'long-term', label: 'Long-term', description: 'Home, retirement, big goals' },
  { value: 'emergency-fund', label: 'Emergency fund', description: 'Rainy-day safety net' },
];

export const ONBOARDING_STEPS = [
  'Welcome',
  'Income',
  'Lifestyle',
  'Savings',
  'Family',
  'Currency',
  'Photo',
  'Success',
] as const;

export function getDefaultOnboardingDraft(): Omit<
  OnboardingData,
  'completedAt' | 'skipped'
> {
  return {
    incomeRange: '30k-60k',
    lifestyle: 'professional',
    savingsGoal: 'emergency-fund',
    dependents: 0,
    currencyCode: 'USD',
    avatarUri: null,
  };
}
