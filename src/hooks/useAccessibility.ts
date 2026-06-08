import { useTheme } from '../context/ThemeContext';

export function useAccessibility() {
  const { fontScale, largerText } = useTheme();

  const scaled = (size: number) => Math.round(size * fontScale);

  const a11yProps = (label: string, hint?: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'text' as const,
  });

  const buttonA11y = (label: string, hint?: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button' as const,
  });

  return { scaled, largerText, fontScale, a11yProps, buttonA11y };
}
