import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import { experience } from '@lib/data';

// ── Timeline node dot ──────────────────────────────────────────────────────
function TimelineDot({ active }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0 z-10">
      {/* Outer ring */}
      <div
        className={`w-4 h-4 rounded-full border-2 transition-colors duration-300
                    ${active ? 'border-phosphor bg-phosphor/20' : 'border-signal bg-signal/10'}`}
      />
      {/* Inner pip */}
      <div
        className={`absolute w-1.5 h-1.5 rounded-full
                    ${active ? 'bg-phosphor' : 'bg-signal'}`}
      />
    </div>
  );
}

// ── Single experience card ─────────────────────────────────────────────────
interface ExpCardProps {
  roleKey: string;
  company: string;
  companyUrl?: string;
  periodKey: string;
  descriptionKey: string;
  bulletKeys: string[];
  stack?: string[];
  index: number;
  isActive?: boolean;
  t: (key: string) => string;
}

function ExpCard({ roleKey, company, companyUrl, periodKey, descriptionKey, bulletKeys, stack, index, isActive, t }: ExpCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (prefersReducedMotion) {
      card.style.opacity = '1';
      card.style.transform = 'none';
      return;
    }

    // Alternate: even index slides from left, odd from right
    const fromX = index % 2 === 0 ? -48 : 48;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { x: fromX, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        },
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`rounded-xl border p-6 bg-ink transition-colors duration-200
                  ${isActive
                    ? 'border-phosphor/40 hover:border-phosphor/70'
                    : 'border-steel/60 hover:border-signal/50'}`}
      style={{ opacity: 0 }}
    >
      {/* Active glow */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(96,239,188,0.04) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
        <div>
          <h3 className="font-display font-bold text-chalk text-lg leading-snug">{t(roleKey)}</h3>
          {companyUrl ? (
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-mono text-sm mt-0.5 hover:underline underline-offset-2 ${isActive ? 'text-phosphor' : 'text-signal'}`}
            >
              {t(company)}
            </a>
          ) : (
            <p className={`font-mono text-sm mt-0.5 ${isActive ? 'text-phosphor' : 'text-signal'}`}>
              {t(company)}
            </p>
          )}
        </div>
        <span className="font-mono text-xs text-muted border border-steel/50 rounded px-2.5 py-1 shrink-0 self-start">
          {t(periodKey)}
        </span>
      </div>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed mb-4">{t(descriptionKey)}</p>

      {/* Bullet points */}
      <ul className="space-y-2 mb-4">
        {bulletKeys.map((key, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
            <span
              className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-phosphor' : 'bg-signal'}`}
              aria-hidden="true"
            />
            {t(key)}
          </li>
        ))}
      </ul>

      {/* Stack pills */}
      {stack && stack.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-steel/30">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-2.5 py-1 rounded bg-steel/20 text-muted border border-steel/40"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Education card ─────────────────────────────────────────────────────────
function EduCard({ t }: { t: (key: string) => string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (prefersReducedMotion) {
      card.style.opacity = '1';
      card.style.transform = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        },
      );
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-steel/50 bg-ink p-6 hover:border-signal/40 transition-colors duration-200"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Graduation cap glyph */}
        <span className="text-signal font-mono text-xl" aria-hidden="true">⬡</span>
        <p className="font-mono text-signal text-xs tracking-widest uppercase">{t('experience.eduLabel')}</p>
      </div>
      <h3 className="font-display font-bold text-chalk text-lg">{t('experience.eduDegree')}</h3>
      <p className="font-mono text-sm text-muted mt-0.5">{t('experience.eduSchool')}</p>
      <p className="font-mono text-xs text-muted/60 mt-1">{t('experience.eduPeriod')}</p>
      <p className="text-muted text-sm leading-relaxed mt-3 border-t border-steel/30 pt-3">
        {t('experience.eduNote')}
      </p>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const spineRef   = useRef<HTMLDivElement>(null);
  const { t } = useT();

  // Heading entrance
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    if (prefersReducedMotion) {
      heading.style.opacity = '1';
      heading.style.transform = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 75%', once: true },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Timeline spine draws itself downward on scroll
  useEffect(() => {
    const spine = spineRef.current;
    if (!spine || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.5,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 bg-ink overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Heading ── */}
        <div
          ref={headingRef}
          style={prefersReducedMotion ? undefined : { opacity: 0, transform: 'translateY(32px)' }}
        >
          <p className="font-mono text-signal text-xs tracking-widest uppercase mb-3">
            {t('experience.eyebrow')}
          </p>
          <h2
            className="font-display font-extrabold text-chalk tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('experience.heading')}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #60efbc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {t('experience.headingAccent')}
            </span>
          </h2>
        </div>

        {/* ── Timeline ── */}
        <div className="mt-14 relative">

          {/* Spine — hidden on mobile, visible md+ */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-steel/40">
            {/* Animated fill overlay */}
            <div
              ref={spineRef}
              className="absolute inset-0 bg-linear-to-b from-signal/60 to-phosphor/60"
              style={{ transformOrigin: 'top center' }}
            />
          </div>

          {/* Experience entries */}
          <div className="space-y-10">
            {experience.map((entry, i) => {
              const isActive = i === 0; // Terapage — current role
              const isLeft = i % 2 === 0;

              return (
                <div key={entry.company} className="relative md:grid md:grid-cols-2 md:gap-8 items-start">

                  {/* Timeline dot — centred on the spine (desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10">
                    <TimelineDot active={isActive} />
                  </div>

                  {/* Card positioning: even → left col, odd → right col (offset) */}
                  {isLeft ? (
                    <>
                      <div className="md:pr-10">
                        <ExpCard {...entry} index={i} isActive={isActive} t={t} />
                      </div>
                      <div className="hidden md:block" /> {/* right col spacer */}
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" /> {/* left col spacer */}
                      <div className="md:pl-10">
                        <ExpCard {...entry} index={i} isActive={isActive} t={t} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Education node ── */}
          <div className="relative mt-10 md:flex md:justify-center">
            {/* Dot on spine */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 z-10">
              <TimelineDot />
            </div>
            {/* Card — centred, narrower than full width */}
            <div className="md:w-[calc(50%-2rem)]">
              <EduCard t={t} />
            </div>
          </div>

          {/* Spine end cap */}
          <div className="hidden md:flex justify-center mt-6">
            <div className="w-3 h-3 rounded-full border-2 border-steel/50 bg-ink" />
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />
    </section>
  );
}
