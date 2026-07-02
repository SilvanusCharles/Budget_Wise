import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getDefaultOnboardingDraft } from '../constants/onboarding';
import { IncomeRange, Lifestyle, OnboardingData, SavingsGoal } from '../types';

export type OnboardingDraft = Omit<OnboardingData, 'completedAt' | 'skipped'>;

interface OnboardingContextValue {
  draft: OnboardingDraft;
  stepIndex: number;
  setStepIndex: (index: number) => void;
  setIncomeRange: (value: IncomeRange) => void;
  setLifestyle: (value: Lifestyle) => void;
  setSavingsGoal: (value: SavingsGoal) => void;
  setDependents: (value: number) => void;
  setCurrencyCode: (value: string) => void;
  setAvatarUri: (value: string | null) => void;
  resetDraft: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<OnboardingDraft>(getDefaultOnboardingDraft());
  const [stepIndex, setStepIndex] = useState(0);

  const patch = useCallback((partial: Partial<OnboardingDraft>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      draft,
      stepIndex,
      setStepIndex,
      setIncomeRange: (incomeRange) => patch({ incomeRange }),
      setLifestyle: (lifestyle) => patch({ lifestyle }),
      setSavingsGoal: (savingsGoal) => patch({ savingsGoal }),
      setDependents: (dependents) => patch({ dependents }),
      setCurrencyCode: (currencyCode) => patch({ currencyCode }),
      setAvatarUri: (avatarUri) => patch({ avatarUri }),
      resetDraft: () => {
        setDraft(getDefaultOnboardingDraft());
        setStepIndex(0);
      },
    }),
    [draft, stepIndex, patch],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
