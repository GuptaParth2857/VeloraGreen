import enMessages from './messages/en.json';

const messages: Record<string, Record<string, unknown>> = {
  en: enMessages,
};

export function getTranslations(locale: string = 'en') {
  const lang = locale in messages ? locale : 'en';
  return messages[lang] as Record<string, unknown>;
}

export function getMessage(path: string, locale: string = 'en'): string {
  const t = getTranslations(locale);
  const keys = path.split('.');
  let result: unknown = t;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof result === 'string' ? result : path;
}
