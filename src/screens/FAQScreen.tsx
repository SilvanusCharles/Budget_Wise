import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

const FAQ_ITEMS = [
  {
    q: 'How do presets work?',
    a: 'Presets define how your budget is split across categories. Each category has a percentage, and all percentages must total 100%.',
  },
  {
    q: 'Is my data stored online?',
    a: 'No. Budget Vibes is offline-first. Your presets, profile, and settings are saved locally on your device using AsyncStorage.',
  },
  {
    q: 'How are currencies handled?',
    a: 'Choose your currency in Profile. Conversion rates are stored locally for now. Amounts on the Home screen use your selected currency symbol.',
  },
  {
    q: 'Can I share my budget chart?',
    a: 'Yes. On the Home screen, after entering an amount and selecting a preset, tap "Share chart" to export the breakdown as an image.',
  },
  {
    q: 'What is the 50/30/20 rule?',
    a: 'A popular budgeting method: 50% for needs, 30% for wants, and 20% for savings. It is included as a default preset you can customize.',
  },
];

export function FAQScreen() {
  const { colors } = useTheme();
  const { scaled } = useAccessibility();

  return (
    <ScreenContainer>
      <Text style={[styles.intro, { color: colors.muted, fontSize: scaled(14) }]}>
        Quick answers about Budget Vibes.
      </Text>

      {FAQ_ITEMS.map((item) => (
        <View
          key={item.q}
          style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
          accessibilityRole="text"
          accessibilityLabel={`${item.q}. ${item.a}`}
        >
          <Text style={[styles.question, { color: colors.text, fontSize: scaled(16) }]}>
            {item.q}
          </Text>
          <Text style={[styles.answer, { color: colors.muted, fontSize: scaled(14) }]}>
            {item.a}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  question: {
    fontWeight: '700',
    marginBottom: 8,
  },
  answer: {
    lineHeight: 21,
  },
});
