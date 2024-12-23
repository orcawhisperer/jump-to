// src/hooks/useShortcuts.ts
import { useState, useEffect, useCallback } from 'react';
import { ShortcutMap, Shortcut, RecentItem } from '@/types';
import { StorageService } from '@/services/storage';
import { UrlService } from '@/services/url';
import { AnalyticsService } from '@/services/analytics';

const MAX_RECENT_ITEMS = 10;

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<ShortcutMap>({});
  const [recentlyUsed, setRecentlyUsed] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShortcuts = useCallback(async () => {
    try {
      setLoading(true);
      const [shortcutsData, recentData] = await Promise.all([
        StorageService.getShortcuts(),
        StorageService.getRecentlyUsed()
      ]);
      setShortcuts(shortcutsData);
      setRecentlyUsed(recentData);
      setError(null);
    } catch (err) {
      setError('Failed to load shortcuts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addShortcut = useCallback(
    async (key: string, url: string, category?: string) => {
      try {
        const { shortcut, url: sanitizedUrl } = UrlService.validateAndSanitize(key, url);

        const safety = await UrlService.validateSafety(sanitizedUrl);
        if (!safety.safe) {
          throw new Error(safety.reason || 'URL failed safety check');
        }

        const settings = await StorageService.getSettings();
        const newShortcut: Shortcut = {
          url: sanitizedUrl,
          category: category || settings.defaultCategory,
          created: Date.now(),
          usageCount: 0
        };

        const updatedShortcuts = { ...shortcuts, [shortcut]: newShortcut };
        await StorageService.setShortcuts(updatedShortcuts);
        setShortcuts(updatedShortcuts);

        await AnalyticsService.trackEvent('shortcut_added', { shortcut, url: sanitizedUrl });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add shortcut');
        return false;
      }
    },
    [shortcuts]
  );

  const deleteShortcut = useCallback(
    async (key: string) => {
      try {
        const updatedShortcuts = { ...shortcuts };
        delete updatedShortcuts[key];

        // Remove from recently used as well
        const updatedRecent = recentlyUsed.filter(item => item.shortcut !== key);

        await Promise.all([
          StorageService.setShortcuts(updatedShortcuts),
          StorageService.setRecentlyUsed(updatedRecent)
        ]);

        setShortcuts(updatedShortcuts);
        setRecentlyUsed(updatedRecent);

        await AnalyticsService.trackEvent('shortcut_deleted', { shortcut: key });
        return true;
      } catch (err) {
        setError('Failed to delete shortcut');
        return false;
      }
    },
    [shortcuts, recentlyUsed]
  );

  const updateShortcut = useCallback(
    async (key: string, updates: Partial<Shortcut>) => {
      try {
        if (updates.url) {
          const { url: sanitizedUrl } = UrlService.validateAndSanitize(key, updates.url);
          updates.url = sanitizedUrl;
        }

        const updatedShortcuts = {
          ...shortcuts,
          [key]: { ...shortcuts[key], ...updates }
        };

        await StorageService.setShortcuts(updatedShortcuts);
        setShortcuts(updatedShortcuts);
        await AnalyticsService.trackEvent('shortcut_updated', { shortcut: key, updates });
        return true;
      } catch (err) {
        setError('Failed to update shortcut');
        return false;
      }
    },
    [shortcuts]
  );

  const trackUsage = useCallback(
    async (key: string) => {
      try {
        const shortcut = shortcuts[key];
        if (!shortcut) return;

        // Update shortcut usage count
        const updatedShortcut = {
          ...shortcut,
          usageCount: (shortcut.usageCount || 0) + 1,
          lastUsed: Date.now()
        };

        // Update recently used
        const newRecentItem: RecentItem = {
          shortcut: key,
          timestamp: Date.now()
        };

        const updatedRecent = [
          newRecentItem,
          ...recentlyUsed.filter(item => item.shortcut !== key)
        ].slice(0, MAX_RECENT_ITEMS);

        const updatedShortcuts = { ...shortcuts, [key]: updatedShortcut };

        await Promise.all([
          StorageService.setShortcuts(updatedShortcuts),
          StorageService.setRecentlyUsed(updatedRecent)
        ]);

        setShortcuts(updatedShortcuts);
        setRecentlyUsed(updatedRecent);

        await AnalyticsService.trackEvent('shortcut_used', { shortcut: key });
      } catch (err) {
        console.error('Failed to track usage:', err);
      }
    },
    [shortcuts, recentlyUsed]
  );

  const importShortcuts = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const imported = JSON.parse(text);

        if (!imported || typeof imported !== 'object') {
          throw new Error('Invalid import file format');
        }

        const merged = { ...shortcuts, ...imported };
        await StorageService.setShortcuts(merged);
        setShortcuts(merged);
        await AnalyticsService.trackEvent('shortcuts_imported', {
          count: Object.keys(imported).length
        });
        return true;
      } catch (err) {
        setError('Failed to import shortcuts');
        return false;
      }
    },
    [shortcuts]
  );

  const exportShortcuts = useCallback(async () => {
    try {
      const data = JSON.stringify(shortcuts, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'jumpto-shortcuts.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await AnalyticsService.trackEvent('shortcuts_exported', {
        count: Object.keys(shortcuts).length
      });
      return true;
    } catch (err) {
      setError('Failed to export shortcuts');
      return false;
    }
  }, [shortcuts]);

  const clearRecent = useCallback(async () => {
    try {
      await StorageService.setRecentlyUsed([]);
      setRecentlyUsed([]);
      await AnalyticsService.trackEvent('recent_cleared', { reason: 'User action' });
      return true;
    } catch (err) {
      setError('Failed to clear recent items');
      return false;
    }
  }, []);

  const removeFromRecent = useCallback(
    async (index: number) => {
      try {
        const updatedRecent = [...recentlyUsed];
        updatedRecent.splice(index, 1);
        await StorageService.setRecentlyUsed(updatedRecent);
        setRecentlyUsed(updatedRecent);
        return true;
      } catch (err) {
        setError('Failed to remove recent item');
        return false;
      }
    },
    [recentlyUsed]
  );

  useEffect(() => {
    loadShortcuts();
  }, [loadShortcuts]);

  return {
    shortcuts,
    recentlyUsed,
    loading,
    error,
    addShortcut,
    deleteShortcut,
    updateShortcut,
    trackUsage,
    importShortcuts,
    exportShortcuts,
    clearRecent,
    removeFromRecent,
    refreshShortcuts: loadShortcuts
  };
}
