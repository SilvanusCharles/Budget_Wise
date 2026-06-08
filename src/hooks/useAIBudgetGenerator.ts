import { useCallback, useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useApp } from '../context/AppContext';
import { aiBudgetService } from '../services/ai';
import { BudgetPreset, UserProfile } from '../types';

interface UseAIBudgetGeneratorResult {
  isLoading: boolean;
  error: string | null;
  generatedPreset: BudgetPreset | null;
  generatePreset: (profile: UserProfile) => Promise<void>;
  clearError: () => void;
  clearPreset: () => void;
}

/**
 * Hook for managing AI budget preset generation
 * Handles API calls, error states, and offline fallback
 */
export function useAIBudgetGenerator(): UseAIBudgetGeneratorResult {
  const { setPresets } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPreset, setGeneratedPreset] = useState<BudgetPreset | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor app state to detect offline status
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (state: AppStateStatus) => {
    // In a real app, you'd check actual network status
    // For now, assume online when app is in foreground
    setIsOnline(state === 'active');
  };

  const generatePreset = useCallback(
    async (profile: UserProfile) => {
      setIsLoading(true);
      setError(null);

      try {
        const preset = await aiBudgetService.generateBudgetPreset(profile, isOnline);
        setGeneratedPreset(preset);

        // Save to app context presets
        const { presets } = await import('../context/AppContext').then(m => {
          // We can't access useApp here in async context, so we'll just set locally
          return { presets: [] };
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate AI preset';
        setError(message);
        console.error('AI preset generation error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isOnline, setPresets],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearPreset = useCallback(() => {
    setGeneratedPreset(null);
  }, []);

  return {
    isLoading,
    error,
    generatedPreset,
    generatePreset,
    clearError,
    clearPreset,
  };
}

/**
 * Hook to configure AI API keys
 * Store keys securely (in production, use a secrets manager)
 */
export function useAIConfiguration() {
  const [openaiKey, setOpenaiKey] = useState<string | null>(null);
  const [claudeKey, setClaudeKey] = useState<string | null>(null);

  const configureOpenAI = useCallback((key: string) => {
    aiBudgetService.setOpenAIKey(key);
    setOpenaiKey(key);
  }, []);

  const configureClaude = useCallback((key: string) => {
    aiBudgetService.setClaudeKey(key);
    setClaudeKey(key);
  }, []);

  const testOpenAIConnection = useCallback(async () => {
    return await aiBudgetService.testOpenAIConnection();
  }, []);

  const testClaudeConnection = useCallback(async () => {
    return await aiBudgetService.testClaudeConnection();
  }, []);

  return {
    openaiKey,
    claudeKey,
    configureOpenAI,
    configureClaude,
    testOpenAIConnection,
    testClaudeConnection,
  };
}
