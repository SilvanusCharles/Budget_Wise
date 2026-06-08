import { CurrencyRate } from '../types';

/** Static conversion rates (base: USD). Replace with API fetch later. */
export const DEFAULT_CURRENCY_RATES: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUsd: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUsd: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUsd: 0.79 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rateToUsd: 1550 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateToUsd: 156 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rateToUsd: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.52 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rateToUsd: 83.5 },
];

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Strip commas and parse a budget input string into a number. */
export function parseAmountInput(text: string): number {
  const cleaned = text.replace(/,/g, '');
  if (!cleaned || cleaned === '.') return 0;
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Format digits as the user types (e.g. 30000 → 30,000). */
export function formatAmountInput(text: string): string {
  let cleaned = text.replace(/,/g, '').replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');
  if (dotIndex !== -1) {
    cleaned = cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, '');
  }

  const [intPart = '', decPart] = cleaned.split('.');
  const intFormatted = intPart === '' ? '' : Number(intPart).toLocaleString('en-US');

  if (dotIndex !== -1) {
    return decPart !== undefined ? `${intFormatted}.${decPart}` : `${intFormatted}.`;
  }
  return intFormatted;
}

export function convertFromUsd(amountUsd: number, rateToUsd: number): number {
  return amountUsd * rateToUsd;
}

export function convertToUsd(amount: number, rateToUsd: number): number {
  return amount / rateToUsd;
}
