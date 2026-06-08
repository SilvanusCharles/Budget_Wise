import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BudgetCategory, BudgetPreset } from '../types';
import { ChartColors } from '../constants/colors';
import { createPreset, updatePreset } from '../services/budget';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface PresetFormProps {
  initial?: BudgetPreset;
  onSave: (preset: BudgetPreset) => void;
  onCancel: () => void;
}

function emptyCategory(index: number): BudgetCategory {
  return {
    id: `new-${index}`,
    name: '',
    percentage: 0,
    color: ChartColors[index % ChartColors.length],
  };
}

export function PresetForm({ initial, onSave, onCancel }: PresetFormProps) {
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();

  const [name, setName] = useState(initial?.name ?? '');
  const [categories, setCategories] = useState<BudgetCategory[]>(
    initial?.categories ?? [emptyCategory(0), emptyCategory(1), emptyCategory(2)],
  );

  const total = categories.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);

  const updateCategory = (index: number, field: keyof BudgetCategory, value: string) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === index
          ? {
              ...cat,
              [field]: field === 'percentage' ? Number(value) || 0 : value,
            }
          : cat,
      ),
    );
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, emptyCategory(prev.length)]);
  };

  const removeCategory = (index: number) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const result = initial
      ? updatePreset(initial, name, categories)
      : createPreset(name, categories);

    if ('error' in result) {
      Alert.alert('Invalid preset', result.error);
      return;
    }

    onSave(result);
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.text, fontSize: scaled(14) }]}>
        Preset name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. Monthly Budget"
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text, backgroundColor: colors.white },
        ]}
        accessibilityLabel="Preset name"
      />

      <Text style={[styles.label, { color: colors.text, fontSize: scaled(14), marginTop: 16 }]}>
        Categories ({total}% / 100%)
      </Text>

      {categories.map((cat, index) => (
        <View key={cat.id} style={styles.row}>
          <View
            style={[styles.colorDot, { backgroundColor: cat.color ?? ChartColors[index % ChartColors.length] }]}
          />
          <TextInput
            value={cat.name}
            onChangeText={(v) => updateCategory(index, 'name', v)}
            placeholder="Category"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              styles.nameInput,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.white },
            ]}
            accessibilityLabel={`Category ${index + 1} name`}
          />
          <TextInput
            value={String(cat.percentage || '')}
            onChangeText={(v) => updateCategory(index, 'percentage', v)}
            placeholder="%"
            keyboardType="numeric"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              styles.percentInput,
              { borderColor: colors.border, color: colors.text, backgroundColor: colors.white },
            ]}
            accessibilityLabel={`Category ${index + 1} percentage`}
          />
          <Pressable
            onPress={() => removeCategory(index)}
            {...buttonA11y(`Remove category ${index + 1}`)}
          >
            <Text style={{ color: colors.accent, fontSize: scaled(18) }}>×</Text>
          </Pressable>
        </View>
      ))}

      <Pressable onPress={addCategory} {...buttonA11y('Add category')}>
        <Text style={[styles.addLink, { color: colors.primary, fontSize: scaled(14) }]}>
          + Add category
        </Text>
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          onPress={onCancel}
          style={[styles.btn, styles.btnSecondary, { borderColor: colors.border }]}
          {...buttonA11y('Cancel')}
        >
          <Text style={{ color: colors.text, fontSize: scaled(15) }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={[styles.btn, { backgroundColor: colors.primary }]}
          {...buttonA11y('Save preset')}
        >
          <Text style={{ color: colors.white, fontSize: scaled(15), fontWeight: '600' }}>
            Save
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  nameInput: {
    flex: 1,
  },
  percentInput: {
    width: 64,
    textAlign: 'center',
  },
  addLink: {
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnSecondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});
