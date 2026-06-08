/**
 * EXAMPLE: Enhanced PresetsScreen with AI Integration
 * 
 * This shows how to update the existing PresetsScreen to:
 * 1. Display animated cards for presets
 * 2. Include the AI Budget Suggestion Component
 * 3. Add animated transitions
 * 4. Use AnimatedButton for interactions
 * 
 * Copy the relevant parts into src/screens/PresetsScreen.tsx
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  SectionListRenderItem,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { BudgetPreset } from '../types';
import { getCardShadow } from '../constants/colors';

// New animated components
import { AnimatedCard } from '../components/AnimatedCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { AIBudgetSuggestionComponent } from '../components/AIBudgetSuggestionComponent';
import { ScreenContainer } from '../components/ScreenContainer';

interface PresetSection {
  title: string;
  data: BudgetPreset[];
}

/**
 * EXAMPLE: Updated PresetsScreen with animations and AI
 */
export function PresetsScreenExample() {
  const { presets, setPresets } = useApp();
  const { colors, isDark } = useTheme();
  const { scaled } = useAccessibility();
  const cardShadow = getCardShadow(isDark);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Separate default and AI-generated presets
  const defaultPresets = presets.filter((p) => !p.id.includes('ai-preset'));
  const aiPresets = presets.filter((p) => p.id.includes('ai-preset'));

  const sections: PresetSection[] = [
    { title: 'Default Presets', data: defaultPresets },
    ...(aiPresets.length > 0 ? [{ title: 'AI-Generated', data: aiPresets }] : []),
  ].filter((s) => s.data.length > 0);

  const handlePresetPress = (preset: BudgetPreset) => {
    setSelectedPresetId(selectedPresetId === preset.id ? null : preset.id);
  };

  const handleDeletePreset = async (presetId: string) => {
    const updated = presets.filter((p) => p.id !== presetId);
    await setPresets(updated);
  };

  const renderPresetItem: SectionListRenderItem<BudgetPreset> = ({ item: preset }) => (
    <AnimatedCard
      key={preset.id}
      animationType="slideUp"
      duration={400}
      style={styles.presetCard}
    >
      <Pressable
        onPress={() => handlePresetPress(preset)}
        style={styles.presetPressable}
      >
        <View style={styles.presetHeader}>
          <View>
            <Text
              style={[
                styles.presetName,
                {
                  color: colors.text,
                  fontSize: scaled(16),
                },
              ]}
            >
              {preset.name}
            </Text>
            <Text
              style={[
                styles.categoryCount,
                {
                  color: colors.muted,
                  fontSize: scaled(12),
                },
              ]}
            >
              {preset.categories.length} categories
            </Text>
          </View>
          <Ionicons
            name={selectedPresetId === preset.id ? 'chevron-up' : 'chevron-down'}
            size={scaled(20)}
            color={colors.primary}
          />
        </View>

        {/* Expanded view */}
        {selectedPresetId === preset.id && (
          <View style={styles.expandedContent}>
            {preset.categories.map((cat) => (
              <View key={cat.id} style={styles.categoryRow}>
                <View
                  style={[
                    styles.categoryColor,
                    { backgroundColor: cat.color, width: scaled(12), height: scaled(12) },
                  ]}
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: colors.text,
                      fontSize: scaled(13),
                      marginLeft: scaled(8),
                    },
                  ]}
                >
                  {cat.name}
                </Text>
                <Text
                  style={[
                    styles.percentage,
                    {
                      color: colors.muted,
                      fontSize: scaled(13),
                      marginLeft: 'auto',
                    },
                  ]}
                >
                  {cat.percentage}%
                </Text>
              </View>
            ))}

            {/* Action buttons */}
            <View style={styles.actions}>
              <AnimatedButton
                label="Use This"
                onPress={() => {
                  // Handle use preset
                  handlePresetPress(preset);
                }}
                variant="primary"
                size="small"
                animationType="pulse"
              />
              {preset.id.includes('ai-preset') && (
                <AnimatedButton
                  label="Delete"
                  onPress={() => handleDeletePreset(preset.id)}
                  variant="tertiary"
                  size="small"
                  animationType="fadeIn"
                />
              )}
            </View>
          </View>
        )}
      </Pressable>
    </AnimatedCard>
  );

  return (
    <ScreenContainer>
      {/* AI Budget Suggestion Component */}
      <View style={styles.aiSection}>
        <AIBudgetSuggestionComponent />
      </View>

      {/* Presets List */}
      <View style={styles.presetsSection}>
        <View style={styles.sectionLabel}>
          <View style={[styles.sectionIcon, { backgroundColor: `${colors.primary}22` }]}>
            <Ionicons name="layers-outline" size={scaled(16)} color={colors.primary} />
          </View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                fontSize: scaled(16),
              },
            ]}
          >
            Your Presets
          </Text>
        </View>

        {sections.length > 0 ? (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderPresetItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={[
                  styles.sectionHeader,
                  {
                    color: colors.muted,
                    fontSize: scaled(12),
                  },
                ]}
              >
                {title}
              </Text>
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.muted,
                fontSize: scaled(14),
              },
            ]}
          >
            No presets yet. Generate one using AI or create a custom preset.
          </Text>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  aiSection: {
    marginBottom: 24,
  },
  presetsSection: {
    flex: 1,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionHeader: {
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  presetCard: {
    marginVertical: 8,
  },
  presetPressable: {
    padding: 16,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryCount: {
    fontWeight: '500',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  categoryColor: {
    borderRadius: 2,
  },
  categoryText: {
    fontWeight: '500',
  },
  percentage: {
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontWeight: '500',
    lineHeight: 20,
  },
});

/**
 * Alternative: Minimal example showing just the core animation additions
 * Add this to your existing PresetsScreen:
 * 
 * 1. At the top of the file, add:
 *    import { AnimatedCard } from '../components/AnimatedCard';
 *    import { AnimatedButton } from '../components/AnimatedButton';
 * 
 * 2. Wrap preset items with AnimatedCard:
 *    <AnimatedCard animationType="slideUp">
 *      {existingPresetContent}
 *    </AnimatedCard>
 * 
 * 3. Replace buttons with AnimatedButton:
 *    <AnimatedButton
 *      label="Use Preset"
 *      onPress={handleUsePreset}
 *      variant="primary"
 *    />
 * 
 * 4. Add AI component at the top:
 *    <AIBudgetSuggestionComponent onPresetGenerated={handleNewPreset} />
 */
