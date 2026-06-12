import { useRef, useEffect, useState } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import { skills } from '@lib/data';

// Keyed by labelKey — language-independent
const CATEGORY_GLYPHS: Record<string, string> = {
  'skills.categories.frontend': '◈',
  'skills.categories.mobile':   '⬡',
  'skills.categories.stateUi':  '⬢',
  'skills.categories.backend':  '⬡',
  'skills.categories.database': '◉',
  'skills.categories.tooling':  '⌬',
};

const CATEGORY_ACCENT: Record<string, string> = {
  'skills.categories.frontend': 'var(--color-signal)',
  'skills.categories.mobile':   'var(--color-phosphor)',
  'skills.categories.stateUi':  'var(--color-signal)',
  'skills.categories.backend':  'var(--color-phosphor)',
  'skills.categories.database': 'var(--color-signal)',
  'skills.categories.tooling':  'var(--color-phosphor)',
};

interface SkillPillProps {
  name: string;
  accent: string;
  index: number;
}

function SkillPill({ name, accent, index }: SkillPillProps) {
  const pillRef = useRef<HTMLSpanElement>(null);

  function handleEnter() {
    if (prefersReducedMotion || !pillRef.current) return;
    gsap.to(pillRef.current, {
      y: -3,
      boxShadow: `0 0 14px 2px ${accent}33`,
      borderColor: accent,
      duration: 0.18,
      ease: 'power2.out',
    });
  }

  function handleLeave() {
    if (prefersReducedMotion || !pillRef.current) return;
    gsap.to(pillRef.current, {
      y: 0,
      boxShadow: 'none',
      borderColor: 'rgba(30,45,69,0.8)',
      duration: 0.22,
      ease: 'power2.out',
    });
  }

  return (
    <span
      ref={pillRef}
      data-pill
      data-index={index}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="inline-flex items-center gap-2 px-4 py-2 rounded font-mono text-sm
                 bg-ink border border-steel/80 text-chalk cursor-default select-none
                 transition-colors duration-150"
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: accent }}
        aria-hidden="true"
      />
      {name}
    </span>
  );
}

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tabsRef    = useRef<HTMLDivElement>(null);
  const pillsRef   = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  // prefersReducedMotion is a module-level constant — safe as initial state value.
  // Avoids a synchronous setState inside useEffect (which triggers a double render).
  const [hasEntered, setHasEntered] = useState(prefersReducedMotion);

  // Scroll-driven entrance: heading + tabs slide in once
  useEffect(() => {
    if (prefersReducedMotion) return;

    const heading = headingRef.current;
    const tabs    = tabsRef.current;
    if (!heading || !tabs) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          once: true,
        },
        onComplete: () => setHasEntered(true),
      });

      tl.fromTo(
        heading,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
      ).fromTo(
        Array.from(tabs.children),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' },
        '-=0.3',
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pills stagger-in whenever active category changes (after section entered)
  useEffect(() => {
    if (!hasEntered) return;

    const container = pillsRef.current;
    if (!container) return;

    const pills = Array.from(container.querySelectorAll<HTMLElement>('[data-pill]'));

    if (prefersReducedMotion) {
      pills.forEach((p) => {
        p.style.opacity = '1';
        p.style.transform = 'none';
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Reset all to hidden first, then stagger in
      gsap.set(pills, { opacity: 0, y: 20 });
      gsap.to(pills, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.05,
      });
    }, container);

    return () => ctx.revert();
  }, [activeIdx, hasEntered]);

  // Slide the active-tab indicator bar
  useEffect(() => {
    if (!tabsRef.current || !barRef.current) return;
    const tabs  = Array.from(tabsRef.current.querySelectorAll<HTMLElement>('[data-tab]'));
    const tab   = tabs[activeIdx];
    if (!tab) return;

    const left  = tab.offsetLeft;
    const width = tab.offsetWidth;

    if (prefersReducedMotion) {
      if (barRef.current) {
        barRef.current.style.left  = `${left}px`;
        barRef.current.style.width = `${width}px`;
      }
      return;
    }

    gsap.to(barRef.current, {
      left,
      width,
      duration: 0.32,
      ease: 'power2.inOut',
    });
  }, [activeIdx]);

  const { t } = useT();
  const category = skills[activeIdx];
  const accent   = CATEGORY_ACCENT[category.labelKey] ?? 'var(--color-signal)';

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-28 bg-void overflow-hidden"
    >
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Section heading ── */}
        <div ref={headingRef} style={prefersReducedMotion ? undefined : { opacity: 0, transform: 'translateY(32px)' }}>
          <p className="font-mono text-signal text-xs tracking-widest uppercase mb-3">
            {t('skills.eyebrow')}
          </p>
          <h2 className="font-display font-extrabold text-chalk tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {t('skills.heading')}{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #60efbc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('skills.headingAccent')}
            </span>
          </h2>
          <p className="mt-3 text-muted text-base max-w-lg leading-relaxed">
            {t('skills.body')}
          </p>
        </div>

        {/* ── Category tabs ── */}
        <div
          ref={tabsRef}
          className="relative mt-12 flex flex-wrap gap-1 border-b border-steel/50 pb-0"
        >
          {/* Sliding indicator bar */}
          <div
            ref={barRef}
            className="absolute bottom-0 h-0.5 bg-phosphor rounded-full pointer-events-none"
            style={{ left: 0, width: 0 }}
          />

          {skills.map((cat, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={cat.labelKey}
                data-tab
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-1.5 px-4 py-2.5 font-mono text-xs tracking-wider
                           uppercase transition-colors duration-200 rounded-t select-none
                           focus:outline-none focus-visible:ring-1 focus-visible:ring-signal
                           ${isActive ? 'text-chalk' : 'text-muted hover:text-chalk'}`}
                aria-selected={isActive}
                role="tab"
              >
                <span aria-hidden="true" className="text-[10px]">
                  {CATEGORY_GLYPHS[cat.labelKey] ?? '◈'}
                </span>
                {t(cat.labelKey)}
              </button>
            );
          })}
        </div>

        {/* ── Skills pill grid ── */}
        <div
          ref={pillsRef}
          key={activeIdx}
          className="mt-8 flex flex-wrap gap-3"
          role="tabpanel"
          aria-label={t(category.labelKey)}
        >
          {category.skills.map((skill, i) => (
            <SkillPill key={skill} name={skill} accent={accent} index={i} />
          ))}
        </div>

        {/* ── Count strip at the bottom ── */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-steel/30 pt-10">
          {(
            [
              { value: skills.flatMap((c) => c.skills).length, key: 'technologies' },
              { value: skills.length,                           key: 'domains' },
              { value: 6,                                       key: 'yearsCoding' },
              { value: 3,                                       key: 'yearsProd' },
            ] as const
          ).map(({ value, key }) => (
            <div key={key} className="text-center">
              <p
                className="font-display font-extrabold text-phosphor"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}
              >
                {value}+
              </p>
              <p className="font-mono text-muted text-xs tracking-widest uppercase mt-1">
                {t(`skills.stats.${key}`)}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />
    </section>
  );
}
