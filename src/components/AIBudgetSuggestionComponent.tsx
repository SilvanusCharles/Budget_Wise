/**
 * Example: AI Budget Suggestion Component
 * 
 * This component demonstrates how to integrate:
 * - AI Budget Scaffolding Service
 * - Animated Charts
 * - Micro-interactions (AnimatedButton)
 * - Success animation modal
 * - Loading states
 * 
 * Can be added to PresetsScreen or standalone
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { useAIBudgetGenerator, useAIConfiguration } from '../hooks/useAIBudgetGenerator';
import { AnimatedButton } from './AnimatedButton';
import { AnimatedCard } from './AnimatedCard';
import { AnimatedPieChart } from './AnimatedPieChart';
import { SuccessAnimationModal } from './SuccessAnimationModal';
import { Ionicons } from '@expo/vector-icons';

interface AIBudgetSuggestionComponentProps {
  onPresetGenerated?: (presetId: string) => void;
}

export function AIBudgetSuggestionComponent({
  onPresetGenerated,
}: AIBudgetSuggestionComponentProps) {
  const { profile, setPresets, presets } = useApp();
  const { colors } = useTheme();
  const { scaled } = useAccessibility();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    isLoading,
    error,
    generatedPreset,
    generatePreset,
    clearError,
    clearPreset,
  } = useAIBudgetGenerator();

  const { configureOpenAI, testOpenAIConnection } = useAIConfiguration();

  const handleGenerateAIBudget = async () => {
    clearError();

    // Validate profile
    if (profile.monthlyIncome <= 0) {
      // Show error - need monthly income
      return;
    }

    // Generate preset from AI
    await generatePreset(profile);
  };

  const handleSaveGeneratedPreset = async () => {
    if (!generatedPreset) return;

    // Add to existing presets
    const updatedPresets = [...presets, generatedPreset];
    await setPresets(updatedPresets);

    // Show success animation
    setShowSuccess(true);

    // Callback if provided
    if (onPresetGenerated) {
      onPresetGenerated(generatedPreset.id);
    }

    // Clear after a delay
    setTimeout(() => {
      clearPreset();
      setShowSuccess(false);
    }, 2500);
  };

  return (
    <View style={styles.container}>
      {/* AI Suggestion Section */}
      <AnimatedCard animationType="slideUp" delay={0} duration={600}>
        <View style={styles.header}>
          <View style={[styles.icon, { backgroundColor: `${colors.primary}20` }]}>
            <Ionicons
              name="sparkles"
              size={scaled(20)}
              color={colors.primary}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: scaled(16),
              },
            ]}
          >
            AI-Powered Budget
          </Text>
        </View>

        <Text
          style={[
            styles.description,
            {
              color: colors.muted,
              fontSize: scaled(13),
            },
          ]}
        >
          Let our AI create a personalized budget based on your profile
        </Text>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text
              style={[
                styles.loadingText,
                {
                  color: colors.muted,
                  marginTop: scaled(12),
                  fontSize: scaled(13),
                },
              ]}
            >
              Generating your personalized budget...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.accent}10` }]}>
            <Ionicons name="alert-circle" size={scaled(16)} color={colors.accent} />
            <Text
              style={[
                styles.errorText,
                {
                  color: colors.accent,
                  fontSize: scaled(12),
                  marginLeft: scaled(8),
                },
              ]}
            >
              {error}
            </Text>
          </View>
        )}

        {/* Generated Preset Display */}
        {generatedPreset && !isLoading && (
          <View style={styles.presetDisplay}>
            <Text
              style={[
                styles.presetName,
                {
                  color: colors.text,
                  fontSize: scaled(14),
                },
              ]}
            >
              {generatedPreset.name}
            </Text>

            {/* Show preview of categories */}
            <View style={styles.categoriesPreview}>
              {generatedPreset.categories.map((cat) => (
                <View key={cat.id} style={styles.categoryItem}>
                  <View
                    style={[
                      styles.categoryColor,
                      {
                        backgroundColor: cat.color,
                        width: scaled(10),
                        height: scaled(10),
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.categoryName,
                      {
                        color: colors.text,
                        fontSize: scaled(12),
                        marginLeft: scaled(6),
                      },
                    ]}
                  >
                    {cat.name}: {cat.percentage}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {!generatedPreset ? (
            <AnimatedButton
              label={isLoading ? "Generating..." : "Generate Budget"}
              onPress={handleGenerateAIBudget}
              variant="primary"
              size="medium"
              disabled={isLoading || profile.monthlyIncome <= 0}
              animationType="bounce"
              icon={
                isLoading ? undefined : (
                  <Ionicons name="sparkles" size={16} color="white" />
                )
              }
            />
          ) : (
            <>
              <AnimatedButton
                label="Save Preset"
                onPress={handleSaveGeneratedPreset}
                variant="primary"
                size="medium"
                animationType="bounce"
                icon={<Ionicons name="save" size={16} color="white" />}
              />
              <AnimatedButton
                label="Generate Again"
                onPress={() => {
                  clearPreset();
                  clearError();
                }}
                variant="secondary"
                size="medium"
                animationType="fadeIn"
              />
            </>
          )}
        </View>
      </AnimatedCard>

      {/* Info Section */}
      <AnimatedCard animationType="slideUp" delay={200} duration={600}>
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle"
            size={scaled(16)}
            color={colors.primary}
          />
          <Text
            style={[
              styles.infoText,
              {
                color: colors.muted,
                fontSize: scaled(12),
                marginLeft: scaled(8),
              },
            ]}
          >
            AI suggestions are based on your income, lifestyle, and goals. You can customize
            categories anytime.
          </Text>
        </View>
      </AnimatedCard>

      {/* Success Animation Modal */}
      <SuccessAnimationModal
        visible={showSuccess}
        title="Budget Saved!"
        message={generatedPreset?.name || 'Your AI preset has been saved'}
        onDismiss={() => setShowSuccess(false)}
        autoCloseDuration={2500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    fontWeight: '700',
  },
  description: {
    marginBottom: 16,
    lineHeight: 18,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
  },
  presetDisplay: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  presetName: {
    fontWeight: '700',
    marginBottom: 12,
  },
  categoriesPreview: {
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    borderRadius: 2,
  },
  categoryName: {
    fontWeight: '500',
  },
  buttonsContainer: {
    gap: 10,
    flexDirection: 'row',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    lineHeight: 16,
  },
});
