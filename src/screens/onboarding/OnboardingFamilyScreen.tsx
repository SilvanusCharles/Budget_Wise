import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { OnboardingShell } from '../../components/onboarding/OnboardingShell';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../hooks/useAccessibility';

type Nav = NativeStackNavigationProp<OnboardingStackParamList, 'Family'>;

const SURVEY_STEPS = 7;

export function OnboardingFamilyScreen() {
  const navigation = useNavigation<Nav>();
  const { draft, setDependents } = useOnboarding();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();
  const [text, setText] = useState(String(draft.dependents));

  const adjust = (delta: number) => {
    const next = Math.max(0, Math.min(20, draft.dependents + delta));
    setDependents(next);
    setText(String(next));
  };

  return (
    <OnboardingShell
      step={5}
      totalSteps={SURVEY_STEPS}
      title="Family size & dependents"
      subtitle="How many people depend on this budget?"
      onBack={() => navigation.goBack()}
      onSkip={() => navigation.navigate('Success', { skipped: true })}
      onNext={() => navigation.navigate('Currency')}
    >
      <Text style={[styles.label, { color: colors.muted, fontSize: scaled(14) }]}>
        Number of dependents
      </Text>
      <View style={styles.counterRow}>
        <Pressable
          onPress={() => adjust(-1)}
          style={[styles.counterBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          {...buttonA11y('Decrease dependents')}
        >
          <Ionicons name="remove" size={scaled(22)} color={colors.text} />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={(v) => {
            const digits = v.replace(/\D/g, '');
            setText(digits);
            const num = digits === '' ? 0 : Math.min(20, parseInt(digits, 10));
            setDependents(num);
          }}
          keyboardType="number-pad"
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text, backgroundColor: colors.background },
          ]}
          accessibilityLabel="Dependents count"
        />

        <Pressable
          onPress={() => adjust(1)}
          style={[styles.counterBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
          {...buttonA11y('Increase dependents')}
        >
          <Ionicons name="add" size={scaled(22)} color={colors.text} />
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: colors.muted, fontSize: scaled(13) }]}>
        Include children, elderly parents, or others you regularly support.
      </Text>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600', marginBottom: 12 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
  },
  hint: { marginTop: 16, lineHeight: 20 },
});
