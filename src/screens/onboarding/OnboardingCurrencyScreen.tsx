import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { useApp } from '../../context/AppContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Currency'>;

const SURVEY_STEPS = 7;

export function OnboardingCurrencyScreen() {
  const navigation = useNavigation<Nav>();
  const { currencyRates } = useApp();
  const { draft, setCurrencyCode } = useOnboarding();
  const { colors } = useTheme();
  const { scaled } = useAccessibility();

  return (
    <OnboardingShell
      step={6}
      totalSteps={SURVEY_STEPS}
      title="Choose your currency"
      subtitle="You can change this later in Profile."
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      onNext={() => navigation.navigate('Photo')}
      nextLabel="Almost done"
    >
      <View style={styles.grid}>
        {currencyRates.map((currency) => {
          const selected = draft.currencyCode === currency.code;
          return (
            <Pressable
              key={currency.code}
              onPress={() => setCurrencyCode(currency.code)}
              style={[
                styles.chip,
                {
                  borderColor: selected ? colors.accent : colors.border,
                  backgroundColor: selected ? `${colors.accent}14` : colors.background,
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${currency.name}, ${currency.symbol}`}
            >
              <Text style={{ color: colors.text, fontSize: scaled(16), fontWeight: '700' }}>
                {currency.code}
              </Text>
              <Text style={{ color: colors.muted, fontSize: scaled(12) }}>{currency.symbol}</Text>
              <Text style={{ color: colors.muted, fontSize: scaled(11), marginTop: 2 }}>
                {currency.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: '47%',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
});
