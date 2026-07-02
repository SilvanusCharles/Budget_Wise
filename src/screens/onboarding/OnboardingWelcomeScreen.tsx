import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';
import { getCardShadow } from '../../constants/colors';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

const SURVEY_STEPS = 7;

export function OnboardingWelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, isDark } = useTheme();
  const { scaled } = useAccessibility();
  const cardShadow = getCardShadow(isDark);

  return (
    <OnboardingShell
      step={1}
      totalSteps={SURVEY_STEPS}
      title="Welcome to Budget Vibes"
      subtitle="A quick survey helps us tailor your experience. You can skip anytime."
      onNext={() => navigation.navigate('Income')}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      showBack={false}
      nextLabel="Let's go"
    >
      <View style={styles.hero}>
        <View style={[styles.iconWrap, cardShadow, { backgroundColor: `${colors.primary}20` }]}>
          <Ionicons name="sparkles" size={scaled(40)} color={colors.primary} />
        </View>
        <Text style={[styles.lead, { color: colors.text, fontSize: scaled(16) }]}>
          We'll ask about your income, lifestyle, savings goals, and preferences — all stored
          locally on your device.
        </Text>
        <View style={styles.points}>
          {['Offline-first & private', 'Multi-currency support', 'Smart budget presets'].map(
            (point) => (
              <View key={point} style={styles.pointRow}>
                <Ionicons name="checkmark-circle" size={scaled(18)} color={colors.accent} />
                <Text style={{ color: colors.muted, fontSize: scaled(14) }}>{point}</Text>
              </View>
            ),
          )}
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center' },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  lead: { textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  points: { width: '100%', gap: 10 },
  pointRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
