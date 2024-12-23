// src/hooks/useSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { Settings } from '@/types';
import { StorageService } from '@/services/storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await StorageService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(
    async (updates: Partial<Settings>): Promise<void> => {
      if (!settings) return;
      try {
        const newSettings = { ...settings, ...updates };
        await StorageService.setSettings(newSettings);
        setSettings(newSettings);
      } catch (err) {
        console.error('Failed to update settings:', err);
      }
    },
    [settings]
  );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    updateSettings
  };
}
