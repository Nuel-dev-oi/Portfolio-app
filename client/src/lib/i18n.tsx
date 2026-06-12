import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import en from '@locales/en.json';
import fr from '@locales/fr.json';

// ── Types ──────────────────────────────────────────────────────────────────
export type Locale = 'en' | 'fr';

// Recursive type that mirrors the shape of the JSON locale files
type TranslationLeaf = string;
type TranslationNode = { [key: string]: TranslationLeaf | TranslationNode };
type Translations = typeof en;

// ── Resources ──────────────────────────────────────────────────────────────
const RESOURCES: Record<Locale, Translations> = { en, fr };

function getInitialLocale(): Locale {
  const stored = localStorage.getItem('locale');
  if (stored === 'en' || stored === 'fr') return stored;
  return navigator.language.startsWith('fr') ? 'fr' : 'en';
}

// ── Dot-path resolver ──────────────────────────────────────────────────────
// t('nav.about') → looks up resources[locale].nav.about
function resolve(obj: TranslationNode, path: string): string {
  const parts = path.split('.');
  let node: TranslationLeaf | TranslationNode = obj;
  for (const part of parts) {
    if (typeof node !== 'object' || !(part in node)) return path; // fallback: key itself
    node = (node as TranslationNode)[part];
  }
  return typeof node === 'string' ? node : path;
}

// ── Context ────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const t = useCallback(
    (key: string) => resolve(RESOURCES[locale] as unknown as TranslationNode, key),
    [locale],
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem('locale', next);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}
