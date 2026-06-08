import { BudgetPreset } from '../types';
import { ChartColors } from './colors';

export const DEFAULT_PRESETS: BudgetPreset[] = [
  {
    id: 'preset-50-30-20',
    name: '50/30/20 Rule',
    categories: [
      { id: 'needs', name: 'Needs', percentage: 50, color: ChartColors[0] },
      { id: 'wants', name: 'Wants', percentage: 30, color: ChartColors[1] },
      { id: 'savings', name: 'Savings', percentage: 20, color: ChartColors[2] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-balanced',
    name: 'Balanced Living',
    categories: [
      { id: 'housing', name: 'Housing', percentage: 35, color: ChartColors[0] },
      { id: 'food', name: 'Food', percentage: 15, color: ChartColors[1] },
      { id: 'transport', name: 'Transport', percentage: 10, color: ChartColors[2] },
      { id: 'fun', name: 'Fun', percentage: 15, color: ChartColors[3] },
      { id: 'savings', name: 'Savings', percentage: 25, color: ChartColors[4] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
