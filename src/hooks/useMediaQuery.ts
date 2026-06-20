'use client';

import { useSyncExternalStore, useCallback } from 'react';

function getMediaQueryList(query: string) {
  if (typeof window === 'undefined') return null;
  return window.matchMedia(query);
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const media = getMediaQueryList(query);
    if (!media) return () => {};
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }, [query]);

  const getSnapshot = useCallback(() => {
    const media = getMediaQueryList(query);
    return media ? media.matches : false;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
