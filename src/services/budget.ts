import { ChartColors } from '../constants/colors';
import { BudgetBreakdownItem, BudgetCategory, BudgetPreset } from '../types';

export function validatePresetCategories(categories: BudgetCategory[]): string | null {
  if (categories.length === 0) {
    return 'Add at least one category.';
  }

  const total = categories.reduce((sum, c) => sum + c.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    return `Percentages must total 100% (currently ${total.toFixed(1)}%).`;
  }

  const emptyName = categories.find((c) => !c.name.trim());
  if (emptyName) {
    return 'Every category needs a name.';
  }

  return null;
}

export function createPreset(
  name: string,
  categories: BudgetCategory[],
): BudgetPreset | { error: string } {
  const validationError = validatePresetCategories(categories);
  if (validationError) {
    return { error: validationError };
  }

  const now = new Date().toISOString();
  return {
    id: `preset-${Date.now()}`,
    name: name.trim() || 'Untitled Preset',
    categories: categories.map((cat, index) => ({
      ...cat,
      id: cat.id || `cat-${Date.now()}-${index}`,
      color: cat.color ?? ChartColors[index % ChartColors.length],
    })),
    createdAt: now,
    updatedAt: now,
  };
}

export function updatePreset(
  preset: BudgetPreset,
  name: string,
  categories: BudgetCategory[],
): BudgetPreset | { error: string } {
  const validationError = validatePresetCategories(categories);
  if (validationError) {
    return { error: validationError };
  }

  return {
    ...preset,
    name: name.trim() || preset.name,
    categories: categories.map((cat, index) => ({
      ...cat,
      color: cat.color ?? ChartColors[index % ChartColors.length],
    })),
    updatedAt: new Date().toISOString(),
  };
}

/** Calculate budget breakdown from amount and preset percentages. */
export function calculateBreakdown(
  amount: number,
  categories: BudgetCategory[],
): BudgetBreakdownItem[] {
  if (amount <= 0 || categories.length === 0) {
    return [];
  }

  return categories.map((category, index) => ({
    categoryId: category.id,
    name: category.name,
    percentage: category.percentage,
    amount: (amount * category.percentage) / 100,
    color: category.color ?? ChartColors[index % ChartColors.length],
  }));
}
