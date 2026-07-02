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

export type IncomeRange = 'under-30k' | '30k-60k' | '60k-100k' | '100k-plus';
export type Lifestyle = 'student' | 'professional' | 'family' | 'retiree';
export type SavingsGoal = 'short-term' | 'long-term' | 'emergency-fund';

export interface OnboardingData {
  incomeRange: IncomeRange;
  lifestyle: Lifestyle;
  savingsGoal: SavingsGoal;
  dependents: number;
  currencyCode: string;
  avatarUri: string | null;
  completedAt: string;
  skipped: boolean;
}

export interface StoredAppData {
  presets: BudgetPreset[];
  profile: UserProfile;
  settings: AppSettings;
  currencyRates: CurrencyRate[];
  onboardingCompleted: boolean;
  onboarding: OnboardingData | null;
}
