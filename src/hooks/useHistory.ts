import { useState, useEffect, useCallback } from 'react';
import type { HistoryData } from '../types';
import { api } from '../services/api';

export function useHistory() {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch {
      console.error('Error loading history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 30000);
    return () => clearInterval(interval);
  }, [loadHistory]);

  return { history, loading, refresh: loadHistory };
}
