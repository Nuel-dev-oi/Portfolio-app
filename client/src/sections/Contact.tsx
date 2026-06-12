import { useRef, useEffect, useState } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import type { ContactFormData } from '@app-types/index';

// ── Form field state ───────────────────────────────────────────────────────
type Status = 'idle' | 'sending' | 'success' | 'error';

// ── Info sidebar items ─────────────────────────────────────────────────────
function InfoRow({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="font-mono text-signal text-base mt-0.5 select-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted text-sm leading-relaxed">{children}</span>
    </div>
  );
}

// ── Single labelled input/textarea ────────────────────────────────────────
interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>>;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-xs text-muted tracking-widest uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-mono text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}

const INPUT_BASE =
  'w-full bg-void border border-steel/60 rounded px-4 py-3 text-chalk text-sm ' +
  'font-body placeholder:text-muted/50 ' +
  'focus:outline-none focus:border-signal transition-colors duration-200 ' +
  'hover:border-steel';

// ── Section ────────────────────────────────────────────────────────────────
export function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLFormElement>(null);
  const sideRef     = useRef<HTMLDivElement>(null);

  const { t } = useT();

  const [form, setForm] = useState<ContactFormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [errors, setErrors]   = useState<Partial<ContactFormData>>({});
  const [status, setStatus]   = useState<Status>('idle');

  // ── Entrance animations (heading + sidebar only) ─────────────────────────
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    if (prefersReducedMotion) {
      heading.style.opacity = '1';
      heading.style.transform = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
      });

      tl.fromTo(heading, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' })
        .fromTo(sideRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Fade-in the form whenever it mounts (initial load + after reset) ─────
  useEffect(() => {
    if (status !== 'idle' || !formRef.current || prefersReducedMotion) return;
    gsap.fromTo(formRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
  }, [status]);

  // ── Client-side validation ───────────────────────────────────────────────
  function validate(): boolean {
    const e: Partial<ContactFormData> = {};
    if (form.name.trim().length < 2)    e.name    = 'At least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (form.subject.trim().length < 3) e.subject = 'At least 3 characters';
    if (form.message.trim().length < 10) e.message = 'At least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    try {
      const base = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const isSending = status === 'sending';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-28 bg-void overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Heading ── */}
        <div
          ref={headingRef}
          style={prefersReducedMotion ? undefined : { opacity: 0, transform: 'translateY(32px)' }}
        >
          <p className="font-mono text-signal text-xs tracking-widest uppercase mb-3">
            {t('contact.eyebrow')}
          </p>
          <h2
            className="font-display font-extrabold text-chalk tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('contact.heading')}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #60efbc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t('contact.headingAccent')}
            </span>
          </h2>
          <p className="mt-3 text-muted text-base max-w-lg leading-relaxed">
            {t('contact.body')}
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 items-start">

          {/* ── Sidebar ── */}
          <div
            ref={sideRef}
            className="flex flex-col gap-6"
            style={prefersReducedMotion ? undefined : { opacity: 0 }}
          >
            {/* Contact info card */}
            <div className="rounded-xl border border-steel/50 bg-ink p-6 flex flex-col gap-5">
              <InfoRow icon="◈">
                <span className="text-chalk font-medium">emmanuelokoro273@gmail.com</span>
              </InfoRow>
              <InfoRow icon="⬡">
                {t('contact.location')}
              </InfoRow>
              <InfoRow icon="◉">
                {t('contact.availability')}
              </InfoRow>
            </div>

            {/* Social links */}
            <div className="rounded-xl border border-steel/50 bg-ink p-6 flex flex-col gap-4">
              <p className="font-mono text-xs text-muted tracking-widest uppercase">// links</p>
              <a
                href="https://github.com/Nuel-dev-oi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-chalk transition-colors duration-150 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                     className="text-signal group-hover:text-phosphor transition-colors duration-150 shrink-0"
                     aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482
                           0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464
                           -.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087
                           2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943
                           0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269
                           2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294
                           2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028
                           2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012
                           2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/Nuel-dev-oi
              </a>
              <a
                href="mailto:emmanuelokoro273@gmail.com"
                className="flex items-center gap-3 text-muted hover:text-chalk transition-colors duration-150 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                     className="text-signal group-hover:text-phosphor transition-colors duration-150 shrink-0"
                     aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                emmanuelokoro273@gmail.com
              </a>
            </div>
          </div>

          {/* ── Form ── */}
          {status === 'success' ? (
            <SuccessCard t={t} onReset={() => setStatus('idle')} />
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 rounded-xl border border-steel/50 bg-ink p-8"
            >
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t('contact.nameLabel')} error={errors.name}>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t('contact.namePlaceholder')}
                    value={form.name}
                    onChange={handleChange}
                    className={`${INPUT_BASE} ${errors.name ? 'border-red-400/60 focus:border-red-400' : ''}`}
                  />
                </Field>
                <Field label={t('contact.emailLabel')} error={errors.email}>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={form.email}
                    onChange={handleChange}
                    className={`${INPUT_BASE} ${errors.email ? 'border-red-400/60 focus:border-red-400' : ''}`}
                  />
                </Field>
              </div>

              <Field label={t('contact.subjectLabel')} error={errors.subject}>
                <input
                  name="subject"
                  type="text"
                  placeholder={t('contact.subjectPlaceholder')}
                  value={form.subject}
                  onChange={handleChange}
                  className={`${INPUT_BASE} ${errors.subject ? 'border-red-400/60 focus:border-red-400' : ''}`}
                />
              </Field>

              <Field label={t('contact.messageLabel')} error={errors.message}>
                <textarea
                  name="message"
                  rows={6}
                  placeholder={t('contact.messagePlaceholder')}
                  value={form.message}
                  onChange={handleChange}
                  className={`${INPUT_BASE} resize-none ${errors.message ? 'border-red-400/60 focus:border-red-400' : ''}`}
                />
              </Field>

              {/* Error banner */}
              {status === 'error' && (
                <div className="rounded border border-red-400/30 bg-red-400/10 px-4 py-3">
                  <p className="font-mono text-xs text-red-400 font-medium">{t('contact.errorTitle')}</p>
                  <p className="text-muted text-xs mt-1">{t('contact.errorBody')}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSending}
                className="mt-1 w-full sm:w-auto sm:self-end px-8 py-3 rounded
                           bg-signal text-void font-mono font-medium text-sm
                           hover:bg-phosphor transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-void/40 border-t-void rounded-full animate-spin" aria-hidden="true" />
                    {t('contact.sending')}
                  </>
                ) : (
                  t('contact.send')
                )}
              </button>
            </form>
          )}

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />
    </section>
  );
}

// ── Success state card ─────────────────────────────────────────────────────
function SuccessCard({ t, onReset }: { t: (k: string) => string; onReset: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return;
    gsap.fromTo(ref.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' });
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center gap-5 rounded-xl border border-phosphor/30
                 bg-ink p-12 text-center min-h-[320px]"
    >
      {/* Animated checkmark */}
      <div className="w-14 h-14 rounded-full border-2 border-phosphor flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
             className="text-phosphor" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="font-display font-bold text-chalk text-xl">{t('contact.successTitle')}</p>
        <p className="text-muted text-sm mt-2 max-w-xs leading-relaxed">{t('contact.successBody')}</p>
      </div>
      <button
        onClick={onReset}
        className="font-mono text-xs text-signal hover:text-phosphor transition-colors duration-150 underline underline-offset-4"
      >
        Send another
      </button>
    </div>
  );
}
