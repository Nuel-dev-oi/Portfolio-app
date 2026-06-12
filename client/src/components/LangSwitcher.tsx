import { useT, type Locale } from '@lib/i18n';

const LANGS: { code: Locale; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export function LangSwitcher() {
  const { locale, setLocale } = useT();

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language selector">
      {LANGS.map(({ code, label, flag }) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-xs
                        transition-colors duration-150 select-none
                        ${isActive ? 'text-chalk bg-steel/40' : 'text-muted hover:text-chalk'}`}
          >
            <span aria-hidden="true">{flag}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
