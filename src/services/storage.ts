import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_CURRENCY_RATES } from '../constants/currencies';
import { DEFAULT_PRESETS } from '../constants/defaultPresets';
import { BudgetPreset, StoredAppData, UserProfile, AppSettings } from '../types';

const STORAGE_KEY = '@budget_vibes_data';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Budget Explorer',
  email: '',
  avatarUri: null,
  currencyCode: 'USD',
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
