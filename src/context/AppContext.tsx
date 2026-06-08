import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BudgetPreset, StoredAppData, UserProfile, AppSettings } from '../types';
import { loadAppData, saveAppData, savePresets, saveProfile, saveSettings } from '../services/storage';

interface AppContextValue extends StoredAppData {
  isLoading: boolean;
  setPresets: (presets: BudgetPreset[]) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  setSettings: (settings: AppSettings) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoredAppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const loaded = await loadAppData();
    setData(loaded);
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const setPresets = useCallback(async (presets: BudgetPreset[]) => {
    await savePresets(presets);
    setData((prev) => (prev ? { ...prev, presets } : prev));
  }, []);

  const setProfile = useCallback(async (profile: UserProfile) => {
    await saveProfile(profile);
    setData((prev) => (prev ? { ...prev, profile } : prev));
  }, []);

  const setSettings = useCallback(async (settings: AppSettings) => {
    await saveSettings(settings);
    setData((prev) => (prev ? { ...prev, settings } : prev));
  }, []);

  const value = useMemo<AppContextValue | null>(() => {
    if (!data) return null;
    return {
      ...data,
      isLoading,
      setPresets,
      setProfile,
      setSettings,
      refresh,
    };
  }, [data, isLoading, setPresets, setProfile, setSettings, refresh]);

  if (!value) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7286A0" />
      </View>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF4E9',
  },
});

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
