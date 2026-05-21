import en from './en.json';
import de from './de.json';

const dicts = { en, de } as const;

export type Locale = keyof typeof dicts;
export const locales = Object.keys(dicts) as Locale[];
export const defaultLocale: Locale = 'en';

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in dicts) return lang as Locale;
  return defaultLocale;
}

function lookup(dict: any, key: string): string | undefined {
  // Try flat key first (e.g. "pricing.tier1.name" as a single property)
  if (dict && typeof dict === 'object' && key in dict && typeof dict[key] === 'string') {
    return dict[key];
  }
  // Then try nested lookup
  const parts = key.split('.');
  let result: any = dict;
  for (const p of parts) {
    if (result && typeof result === 'object' && p in result) {
      result = result[p];
    } else {
      return undefined;
    }
  }
  return typeof result === 'string' ? result : undefined;
}

export function useTranslations(locale: Locale) {
  return function t(key: string) {
    const hit = lookup(dicts[locale], key);
    if (hit !== undefined) return hit;
    const fallback = lookup(dicts[defaultLocale], key);
    if (fallback !== undefined) return fallback;
    return key;
  }
}

// Helper to get relative path for a locale
export function getRelativePath(url: URL, locale: Locale): string {
  const currentLocale = getLocaleFromUrl(url);
  const pathname = url.pathname;
  
  // Remove current locale prefix if it exists and is not default
  let basePage = pathname;
  if (currentLocale !== defaultLocale) {
    basePage = pathname.replace(`/${currentLocale}`, '');
  }
  
  if (basePage === '') basePage = '/';
  
  // Add new locale prefix if it's not default
  if (locale === defaultLocale) {
    return basePage;
  } else {
    return `/${locale}${basePage === '/' ? '' : basePage}`;
  }
}
