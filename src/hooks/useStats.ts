import { useState, useEffect, useCallback } from 'react';
import { UsageStats } from '@/types';
import { StorageService } from '@/services/storage';

export function useStats() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await StorageService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [loadStats]);

  return {
    stats,
    loading
  };
}
