import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CURRENCY_RATES } from '../constants/currencies';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { getDefaultOnboardingDraft } from '../constants/onboarding';
import {
  BudgetPreset,
  OnboardingData,
  StoredAppData,
  UserProfile,
  AppSettings,
} from '../types';

const STORAGE_KEY = '@budget_vibes_data';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Budget Explorer',
  email: '',
  avatarUri: null,
  currencyCode: 'USD',
  monthlyIncome: 0,
  dependents: 0,
};

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  largerText: false,
  chartType: 'pie',
};

export function getDefaultAppData(): StoredAppData {
  return {
    presets: DEFAULT_PRESETS,
    profile: DEFAULT_PROFILE,
    settings: DEFAULT_SETTINGS,
    currencyRates: DEFAULT_CURRENCY_RATES,
    onboardingCompleted: false,
    onboarding: null,
  };
}

export async function loadAppData(): Promise<StoredAppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultAppData();
      await saveAppData(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw) as Partial<StoredAppData>;
    return {
      ...getDefaultAppData(),
      ...parsed,
      presets: parsed.presets ?? DEFAULT_PRESETS,
      profile: { ...DEFAULT_PROFILE, ...parsed.profile },
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      currencyRates: parsed.currencyRates ?? DEFAULT_CURRENCY_RATES,
      onboardingCompleted: parsed.onboardingCompleted ?? false,
      onboarding: parsed.onboarding ?? null,
    };
  } catch {
    return getDefaultAppData();
  }
}

export async function saveAppData(data: StoredAppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function savePresets(presets: BudgetPreset[]): Promise<void> {
  const data = await loadAppData();
  await saveAppData({ ...data, presets });
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const data = await loadAppData();
  await saveAppData({ ...data, profile });
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const data = await loadAppData();
  await saveAppData({ ...data, settings });
}

export async function completeOnboarding(
  draft: Partial<OnboardingData>,
  skipped = false,
): Promise<StoredAppData> {
  const data = await loadAppData();
  const defaults = getDefaultOnboardingDraft();

  const onboarding: OnboardingData = {
    incomeRange: draft.incomeRange ?? defaults.incomeRange,
    lifestyle: draft.lifestyle ?? defaults.lifestyle,
    savingsGoal: draft.savingsGoal ?? defaults.savingsGoal,
    dependents: draft.dependents ?? defaults.dependents,
    currencyCode: draft.currencyCode ?? defaults.currencyCode,
    avatarUri: draft.avatarUri ?? defaults.avatarUri,
    completedAt: new Date().toISOString(),
    skipped,
  };

  const profile: UserProfile = {
    ...data.profile,
    currencyCode: onboarding.currencyCode,
    avatarUri: onboarding.avatarUri ?? data.profile.avatarUri,
  };

  const next: StoredAppData = {
    ...data,
    profile,
    onboarding,
    onboardingCompleted: true,
  };

  await saveAppData(next);
  return next;
}

export async function resetAppData(): Promise<StoredAppData> {
  const defaults = getDefaultAppData();
  await saveAppData(defaults);
  return defaults;
}
