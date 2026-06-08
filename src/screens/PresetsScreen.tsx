import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { PresetForm } from '../components/PresetForm';
import { ScreenContainer } from '../components/ScreenContainer';
import { BudgetPreset } from '../types';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

export function PresetsScreen() {
  const { presets, setPresets } = useApp();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  const [editing, setEditing] = useState<BudgetPreset | 'new' | null>(null);

  const handleSave = async (preset: BudgetPreset) => {
    const exists = presets.some((p) => p.id === preset.id);
    const next = exists
      ? presets.map((p) => (p.id === preset.id ? preset : p))
      : [...presets, preset];
    await setPresets(next);
    setEditing(null);
  };

  const handleDelete = (preset: BudgetPreset) => {
    Alert.alert('Delete preset', `Remove "${preset.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await setPresets(presets.filter((p) => p.id !== preset.id));
        },
      },
    ]);
  };

  if (editing) {
    return (
      <ScreenContainer>
        <Text style={[styles.heading, { color: colors.text, fontSize: scaled(20) }]}>
          {editing === 'new' ? 'New preset' : 'Edit preset'}
        </Text>
        <PresetForm
          initial={editing === 'new' ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={[styles.heading, { color: colors.text, fontSize: scaled(22) }]}>
        Your presets
      </Text>
      <Text style={[styles.subheading, { color: colors.muted, fontSize: scaled(14) }]}>
        Create category splits that total 100%. Saved locally on your device.
      </Text>

      <Pressable
        onPress={() => setEditing('new')}
        style={[styles.createBtn, { backgroundColor: colors.accent }]}
        {...buttonA11y('Create new preset')}
      >
        <Text style={[styles.createBtnText, { fontSize: scaled(15) }]}>+ New preset</Text>
      </Pressable>

      {presets.map((preset) => (
        <View
          key={preset.id}
          style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text, fontSize: scaled(17) }]}>
              {preset.name}
            </Text>
            <View style={styles.cardActions}>
              <Pressable
                onPress={() => setEditing(preset)}
                {...buttonA11y(`Edit ${preset.name}`)}
              >
                <Text style={{ color: colors.primary, fontSize: scaled(14), fontWeight: '600' }}>
                  Edit
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(preset)}
                {...buttonA11y(`Delete ${preset.name}`)}
              >
                <Text style={{ color: colors.accent, fontSize: scaled(14), fontWeight: '600' }}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={{ color: colors.muted, fontSize: scaled(13), lineHeight: 20 }}>
            {preset.categories.map((c) => `${c.name} ${c.percentage}%`).join(' · ')}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginBottom: 6,
  },
  subheading: {
    marginBottom: 20,
    lineHeight: 20,
  },
  createBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 16,
  },
});
