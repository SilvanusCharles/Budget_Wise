import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';
import { getCardShadow } from '../../constants/colors';

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  showSkip?: boolean;
  showNext?: boolean;
}

export function OnboardingShell({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  onSkip,
  nextLabel = 'Continue',
  showBack = true,
  showSkip = true,
  showNext = true,
}: OnboardingShellProps) {
  const { colors, isDark } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();
  const cardShadow = getCardShadow(isDark);
  const progress = step / totalSteps;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          {showBack && onBack ? (
            <Pressable onPress={onBack} style={styles.iconBtn} {...buttonA11y('Go back')}>
              <Ionicons name="chevron-back" size={scaled(24)} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.iconBtn} />
          )}

          <Text style={[styles.stepLabel, { color: colors.muted, fontSize: scaled(13) }]}>
            Step {step} of {totalSteps}
          </Text>

          {showSkip && onSkip ? (
            <Pressable onPress={onSkip} {...buttonA11y('Skip onboarding')}>
              <Text style={[styles.skipText, { color: colors.secondary, fontSize: scaled(14) }]}>
                Skip
              </Text>
            </Pressable>
          ) : (
            <View style={styles.iconBtn} />
          )}
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.max(progress * 100, 8)}%`, backgroundColor: colors.accent },
            ]}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text, fontSize: scaled(26) }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.muted, fontSize: scaled(15) }]}>
              {subtitle}
            </Text>
          ) : null}

          <View style={[styles.card, cardShadow, { backgroundColor: colors.white }]}>{children}</View>
        </ScrollView>

        {showNext && onNext ? (
          <View style={styles.footer}>
            <Pressable
              onPress={onNext}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
              {...buttonA11y(nextLabel)}
            >
              <Text style={[styles.nextText, { fontSize: scaled(16) }]}>{nextLabel}</Text>
              <Ionicons name="arrow-forward" size={scaled(18)} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface OptionChipProps {
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
}

export function OnboardingOption({
  label,
  hint,
  selected,
  onPress,
}: OptionChipProps) {
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? `${colors.primary}14` : colors.background,
        },
      ]}
      accessibilityState={{ selected }}
      {...buttonA11y(label, hint)}
    >
      <Text style={[styles.optionLabel, { color: colors.text, fontSize: scaled(16) }]}>{label}</Text>
      {hint ? (
        <Text style={[styles.optionHint, { color: colors.muted, fontSize: scaled(13) }]}>{hint}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconBtn: { width: 40, height: 40, justifyContent: 'center' },
  stepLabel: { fontWeight: '600' },
  skipText: { fontWeight: '700' },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    marginHorizontal: 20,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 999 },
  scroll: { padding: 20, paddingBottom: 32 },
  title: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { lineHeight: 22, marginBottom: 20 },
  card: { borderRadius: 20, padding: 18 },
  footer: { paddingHorizontal: 20, paddingBottom: 16 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  nextText: { color: '#FFFFFF', fontWeight: '700' },
  option: {
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  optionLabel: { fontWeight: '700' },
  optionHint: { marginTop: 4 },
});
