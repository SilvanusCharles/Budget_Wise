import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetChart } from '../components/BudgetChart';
import { PresetRadioGroup } from '../components/PresetRadioGroup';
import { ScreenContainer } from '../components/ScreenContainer';
import { formatAmountInput, formatCurrency, parseAmountInput } from '../constants/currencies';
import { getCardShadow } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { calculateBreakdown } from '../services/budget';
import { AnimatedPieChart } from '../components/AnimatedPieChart';
import { AnimatedBarChart } from '../components/AnimatedBarChart';
import { AnimatedCard } from '../components/AnimatedCard';

function SectionLabel({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const { colors } = useTheme();
  const { scaled } = useAccessibility();

  return (
    <View style={styles.sectionLabel}>
      <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}22` }]}>
        <Ionicons name={icon} size={scaled(16)} color={colors.primary} />
      </View>
      <Text style={[styles.sectionText, { color: colors.text, fontSize: scaled(15) }]}>
        {label}
      </Text>
    </View>
  );
}

export function HomeScreen() {
  const { presets, profile, settings, currencyRates } = useApp();
  const { colors, isDark } = useTheme();
  const { scaled } = useAccessibility();
  const cardShadow = getCardShadow(isDark);

  const [amountText, setAmountText] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    presets[0]?.id ?? null,
  );

  const amount = parseAmountInput(amountText);
  const selectedPreset = presets.find((p) => p.id === selectedPresetId) ?? null;
  const currency = currencyRates.find((c) => c.code === profile.currencyCode) ?? currencyRates[0];

  const breakdown = useMemo(() => {
    if (!selectedPreset || amount <= 0) return [];
    return calculateBreakdown(amount, selectedPreset.categories);
  }, [amount, selectedPreset]);

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <View style={[styles.blob, styles.blobPrimary, { backgroundColor: `${colors.primary}28` }]} />
        <View style={[styles.blob, styles.blobAccent, { backgroundColor: `${colors.accent}20` }]} />

        <View style={[styles.heroCard, cardShadow, { backgroundColor: colors.white }]}>
          <View style={[styles.heroPill, { backgroundColor: `${colors.accent}18` }]}>
            <Text style={[styles.heroPillText, { color: colors.accent, fontSize: scaled(12) }]}>
              Your money, your vibe
            </Text>
          </View>

          <Text style={[styles.appTitle, { color: colors.text, fontSize: scaled(28) }]}>
            Budget{' '}
            <Text style={{ color: colors.primary }}>Vibes</Text>
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted, fontSize: scaled(14) }]}>
            Enter an amount, pick a preset, and watch your budget come alive.
          </Text>
        </View>
      </View>

      <View style={[styles.amountCard, cardShadow, { backgroundColor: colors.white }]}>
        <SectionLabel icon="wallet-outline" label={`Budget amount · ${currency.code}`} />
        <View
          style={[
            styles.inputRow,
            {
              borderColor: amount > 0 ? colors.primary : colors.border,
              backgroundColor: isDark ? colors.background : '#FFFBF6',
            },
          ]}
        >
          <Text style={[styles.currencyPrefix, { color: colors.primary, fontSize: scaled(22) }]}>
            {currency.symbol}
          </Text>
          <TextInput
            value={amountText}
            onChangeText={(text) => setAmountText(formatAmountInput(text))}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, fontSize: scaled(24) }]}
            accessibilityLabel={`Budget amount in ${currency.name}`}
          />
        </View>

        {amount > 0 && (
          <View style={[styles.totalBadge, { backgroundColor: `${colors.primary}16` }]}>
            <Ionicons name="sparkles-outline" size={scaled(14)} color={colors.primary} />
            <Text
              style={[styles.totalHint, { color: colors.primary, fontSize: scaled(13) }]}
              accessibilityLabel={`Total budget ${formatCurrency(amount, currency.symbol)}`}
            >
              Total {formatCurrency(amount, currency.symbol)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <SectionLabel icon="layers-outline" label="Select preset" />
        <PresetRadioGroup
          presets={presets}
          selectedId={selectedPresetId}
          onSelect={setSelectedPresetId}
        />
      </View>

      <View style={styles.section}>
        <SectionLabel icon="pie-chart-outline" label="Breakdown" />
        {breakdown.length > 0 && (
          <AnimatedCard animationType="fadeIn" delay={100}>
            {settings.chartType === 'pie' ? (
              <AnimatedPieChart data={breakdown} />
            ) : (
              <AnimatedBarChart data={breakdown} />
            )}
          </AnimatedCard>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 22,
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobPrimary: {
    width: 120,
    height: 120,
    top: -18,
    right: -10,
  },
  blobAccent: {
    width: 72,
    height: 72,
    bottom: 8,
    left: -8,
  },
  heroCard: {
    borderRadius: 22,
    padding: 22,
    overflow: 'hidden',
  },
  heroPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  heroPillText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  appTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    lineHeight: 21,
  },
  amountCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 4,
  },
  currencyPrefix: {
    fontWeight: '700',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontWeight: '700',
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  totalHint: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    fontWeight: '700',
  },
});
