import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BudgetPreset } from '../types';
import { getCardShadow } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface PresetRadioGroupProps {
  presets: BudgetPreset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PresetRadioGroup({ presets, selectedId, onSelect }: PresetRadioGroupProps) {
  const { colors, isDark } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();
  const cardShadow = getCardShadow(isDark);

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Budget presets">
      {presets.map((preset) => {
        const selected = preset.id === selectedId;
        return (
          <Pressable
            key={preset.id}
            onPress={() => onSelect(preset.id)}
            style={[
              styles.option,
              cardShadow,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? `${colors.primary}12` : colors.white,
              },
            ]}
            {...buttonA11y(
              `${preset.name}, ${selected ? 'selected' : 'not selected'}`,
              'Double tap to select this budget preset',
            )}
            accessibilityState={{ selected }}
            accessibilityRole="radio"
          >
            <View style={styles.colorStrip}>
              {preset.categories.slice(0, 4).map((cat) => (
                <View
                  key={cat.id}
                  style={[styles.stripSegment, { backgroundColor: cat.color ?? colors.muted }]}
                />
              ))}
            </View>

            <View style={styles.optionBody}>
              <View
                style={[
                  styles.radioOuter,
                  { borderColor: selected ? colors.accent : colors.muted },
                ]}
              >
                {selected && (
                  <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                )}
              </View>

              <View style={styles.optionText}>
                <Text style={[styles.name, { color: colors.text, fontSize: scaled(16) }]}>
                  {preset.name}
                </Text>
                <Text style={[styles.meta, { color: colors.muted, fontSize: scaled(13) }]}>
                  {preset.categories.map((c) => `${c.name} ${c.percentage}%`).join(' · ')}
                </Text>
              </View>

              {selected && (
                <Ionicons name="checkmark-circle" size={scaled(22)} color={colors.accent} />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  colorStrip: {
    flexDirection: 'row',
    height: 4,
  },
  stripSegment: {
    flex: 1,
  },
  optionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
  },
  meta: {
    marginTop: 4,
    lineHeight: 18,
  },
});
