'use client';

import { useCallback, useEffect, useState } from 'react';

const messages: Record<string, Record<string, any>> = {
  en: {} as Record<string, any>,
  hi: {} as Record<string, any>,
};

let loaded = false;

async function loadMessages() {
  if (loaded) return;
  try {
    const [enMod, hiMod] = await Promise.all([
      import('@/i18n/messages/en.json'),
      import('@/i18n/messages/hi.json'),
    ]);
    messages.en = enMod.default || enMod;
    messages.hi = hiMod.default || hiMod;
    loaded = true;
  } catch {
    console.warn('Failed to load i18n messages');
  }
}

function getNestedValue(obj: Record<string, any>, path: string): string {
  const result = path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
  return typeof result === 'string' ? result : path;
}

export function useTranslation() {
  const [locale, setLocale] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('veloragreen-locale');
    if (saved) return saved;
    return navigator.language?.startsWith('hi') ? 'hi' : 'en';
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const t = useCallback((key: string): string => {
    const msg = messages[locale];
    if (!msg) return key;
    return getNestedValue(msg, key) || getNestedValue(messages.en, key) || key;
  }, [locale]);

  const setLocaleAndSave = useCallback((newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('veloragreen-locale', newLocale);
  }, []);

  return { t, locale, setLocale: setLocaleAndSave, isRTL: false };
}
