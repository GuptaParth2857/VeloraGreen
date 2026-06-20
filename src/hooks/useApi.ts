'use client';

import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export function useApi<T = unknown>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || 'Request failed');
      }
      setState({ data: json.data, error: null, isLoading: false });
      return json.data as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed';
      setState(prev => ({ ...prev, error: message, isLoading: false }));
      return null;
    }
  }, []);

  const get = useCallback(
    (url: string) => fetchData(url),
    [fetchData]
  );

  const post = useCallback(
    (url: string, body: unknown) =>
      fetchData(url, { method: 'POST', body: JSON.stringify(body) }),
    [fetchData]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return { ...state, get, post, reset };
}
