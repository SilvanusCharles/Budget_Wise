export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  color?: string;
}

export interface BudgetPreset {
  id: string;
  name: string;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetBreakdownItem {
  categoryId: string;
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUri: string | null;
  currencyCode: string;
}

export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToUsd: number;
}

export interface AppSettings {
  darkMode: boolean;
  largerText: boolean;
  chartType: 'pie' | 'bar';
}

export interface StoredAppData {
  presets: BudgetPreset[];
  profile: UserProfile;
  settings: AppSettings;
  currencyRates: CurrencyRate[];
}
