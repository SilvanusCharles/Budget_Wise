import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { AnimatedCard } from '../components/AnimatedCard';
import { SettingsStackParamList } from '../navigation/types';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAIConfiguration } from '../hooks/useAIBudgetGenerator';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { scaled } = useAccessibility();

  return (
    <View
      style={[styles.row, { backgroundColor: colors.white, borderColor: colors.border }]}
      accessibilityLabel={label}
    >
      <View style={styles.rowText}>
        <Text style={{ color: colors.text, fontSize: scaled(16), fontWeight: '600' }}>{label}</Text>
        {description ? (
          <Text style={{ color: colors.muted, fontSize: scaled(13), marginTop: 2 }}>{description}</Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { settings, setSettings } = useApp();
  const { colors } = useTheme();
  const { scaled, buttonA11y } = useAccessibility();
  const { configureOpenAI } = useAIConfiguration();
  const [openaiKey, setOpenaiKey] = useState('');

  const toggleDarkMode = async (value: boolean) => {
    await setSettings({ ...settings, darkMode: value });
  };

  const toggleLargerText = async (value: boolean) => {
    await setSettings({ ...settings, largerText: value });
  };

  const setChartType = async (chartType: 'pie' | 'bar') => {
    await setSettings({ ...settings, chartType });
  };

  return (
    <ScreenContainer>
      <Text style={[styles.heading, { color: colors.text, fontSize: scaled(22) }]}>
        Settings
      </Text>

      <AnimatedCard animationType="fadeIn" delay={0}>
        <View style={styles.sectionHeader}>
          <Ionicons name="palette-outline" size={20} color={colors.primary} />
          <Text style={[styles.section, { color: colors.muted, fontSize: scaled(12) }]}>APPEARANCE</Text>
        </View>
        <SettingRow label="Dark mode" description="Switch between light and dark themes">
          <Switch
            value={settings.darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={settings.darkMode ? colors.accent : colors.white}
            accessibilityLabel="Dark mode"
          />
        </SettingRow>

        <SettingRow label="Larger text" description="Increase text size for readability">
          <Switch
            value={settings.largerText}
            onValueChange={toggleLargerText}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor={settings.largerText ? colors.accent : colors.white}
            accessibilityLabel="Larger text"
          />
        </SettingRow>
      </AnimatedCard>

      <AnimatedCard animationType="slideUp" delay={100}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles-outline" size={20} color={colors.primary} />
          <Text style={[styles.section, { color: colors.muted, fontSize: scaled(12) }]}>AI FEATURES</Text>
        </View>
        <SettingRow label="OpenAI API Key" description="Enable AI-powered budget suggestions">
          <TextInput
            placeholder="sk-..."
            value={openaiKey}
            onChangeText={setOpenaiKey}
            secureTextEntry
            style={[
              styles.apiKeyInput,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.white },
            ]}
          />
        </SettingRow>
        <AnimatedButton
          label="Save & Test"
          onPress={() => {
            configureOpenAI(openaiKey);
            Alert.alert('API Key Saved', 'Your OpenAI API key has been configured. You can now use AI budget suggestions!');
          }}
          variant="primary"
          size="medium"
          disabled={openaiKey.length === 0}
        />
      </AnimatedCard>

      <AnimatedCard animationType="slideUp" delay={200}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart-outline" size={20} color={colors.primary} />
          <Text style={[styles.section, { color: colors.muted, fontSize: scaled(12) }]}>CHARTS</Text>
        </View>
        <View style={styles.chartToggle}>
          {(['pie', 'bar'] as const).map((type) => {
            const selected = settings.chartType === type;
            return (
              <Pressable
                key={type}
                onPress={() => setChartType(type)}
                style={[
                  styles.chartBtn,
                  {
                    backgroundColor: selected ? colors.primary : colors.white,
                    borderColor: colors.border,
                  },
                ]}
                {...buttonA11y(`${type} chart`, selected ? 'Selected' : 'Not selected')}
                accessibilityState={{ selected }}
              >
                <Text
                  style={{
                    color: selected ? colors.white : colors.text,
                    fontSize: scaled(14),
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AnimatedCard>

      <AnimatedCard animationType="slideUp" delay={300}>
        <View style={styles.sectionHeader}>
          <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.section, { color: colors.muted, fontSize: scaled(12) }]}>HELP</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('FAQ')}
          style={[styles.linkRow, { backgroundColor: colors.white, borderColor: colors.border }]}
          {...buttonA11y('FAQ', 'Opens frequently asked questions')}
        >
          <Text style={{ color: colors.text, fontSize: scaled(16), fontWeight: '600' }}>FAQ</Text>
          <Text style={{ color: colors.primary, fontSize: scaled(20) }}>›</Text>
        </Pressable>
      </AnimatedCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  section: {
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  chartToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  chartBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minWidth: 200,
  },
});
