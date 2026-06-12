import { useState, useEffect, useRef } from 'react';
import { gsap } from '@lib/gsap';
import { useT } from '@lib/i18n';

const WHATSAPP_URL = 'https://wa.me/2348130861405';
const MAILTO = 'mailto:emmanuelokoro273@gmail.com';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

  // Animate panel open/close
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (open) {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 16, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power3.out' },
      );
    } else {
      gsap.to(panel, { opacity: 0, y: 16, scale: 0.95, duration: 0.18, ease: 'power2.in' });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      const panel = panelRef.current;
      if (panel && !panel.contains(e.target as Node)) {
        const btn = document.getElementById('chat-widget-btn');
        if (btn && btn.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  function scrollToContact() {
    setOpen(false);
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="w-72 rounded-2xl border border-steel/60 bg-ink shadow-2xl overflow-hidden"
          style={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-steel/40 bg-void/60">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-phosphor opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-phosphor" />
              </span>
              <span className="font-mono text-xs text-chalk tracking-wide">{t('chat.header')}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-chalk transition-colors"
              aria-label={t('chat.close')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-4 space-y-3">
            <p className="text-muted text-xs leading-relaxed">{t('chat.body')}</p>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-200 group"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-chalk">{t('chat.whatsapp')}</p>
                <p className="text-xs text-muted">{t('chat.whatsappSub')}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted group-hover:text-[#25D366] transition-colors shrink-0">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Email → Contact section */}
            <button
              onClick={scrollToContact}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-signal/10 border border-signal/30 hover:bg-signal/20 hover:border-signal/60 transition-all duration-200 group text-left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-chalk">{t('chat.email')}</p>
                <p className="text-xs text-muted">{t('chat.emailSub')}</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted group-hover:text-signal transition-colors shrink-0">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* mailto direct link */}
            <p className="text-center text-xs text-muted pt-1">
              {t('chat.or')}{' '}
              <a
                href={MAILTO}
                className="text-signal hover:text-chalk underline underline-offset-2 transition-colors"
              >
                {t('chat.mailtoLabel')}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Bubble button */}
      <button
        id="chat-widget-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? t('chat.close') : t('chat.open')}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
          ${open
            ? 'bg-steel/80 hover:bg-steel rotate-90'
            : 'bg-signal hover:bg-blue-400 hover:scale-110'
          }`}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
