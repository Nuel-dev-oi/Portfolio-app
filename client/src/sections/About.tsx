import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import profilePhoto from '@assets/emmanuel.jpeg';

// Converts <signal>…</signal> and <chalk>…</chalk> tags in locale strings into coloured spans.
function richText(str: string): ReactNode[] {
  return str.split(/(<signal>.*?<\/signal>|<chalk>.*?<\/chalk>)/).map((part, i) => {
    if (part.startsWith('<signal>'))
      return <span key={i} className="text-signal font-medium">{part.slice(8, -9)}</span>;
    if (part.startsWith('<chalk>'))
      return <span key={i} className="text-chalk">{part.slice(7, -8)}</span>;
    return part;
  });
}

// Static per-stat data that doesn't need translation
const STAT_VALUES   = ['4+', '10+', '6', '∞'] as const;
const STAT_NUMERICS = [4, 10, 6, 0] as const;
const STAT_T_KEYS   = ['years', 'projects', 'activities', 'eslint'] as const;

function animateCount(el: HTMLElement, target: number, duration: number) {
  if (prefersReducedMotion || target === 0) return;
  const start = performance.now();
  function tick(now: number) {
    const progress = Math.min((now - start) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

export function About() {
  const sectionRef      = useRef<HTMLElement>(null);
  const imageRef        = useRef<HTMLDivElement>(null);
  const textRef         = useRef<HTMLDivElement>(null);
  const statsRef        = useRef<HTMLDivElement>(null);
  const statNumbersRef  = useRef<HTMLSpanElement[]>([]);
  const { t } = useT();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        },
      );

      gsap.fromTo(
        textRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        },
      );

      gsap.fromTo(
        statsRef.current ? Array.from(statsRef.current.children) : [],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
            onEnter: () => {
              statNumbersRef.current.forEach((el, i) => {
                if (el && STAT_NUMERICS[i] > 0) animateCount(el, STAT_NUMERICS[i], 1.2);
              });
            },
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 bg-ink border-b border-steel/30">
      <div className="max-w-6xl mx-auto px-6">

        <p className="font-mono text-signal text-xs tracking-widest uppercase mb-4">
          {t('about.label')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Photo ── */}
          <div ref={imageRef} className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-signal/40 rounded-xl" aria-hidden="true" />
              <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-phosphor rounded-tl" aria-hidden="true" />
              <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-phosphor rounded-br" aria-hidden="true" />
              <div className="relative w-72 h-80 lg:w-80 lg:h-96 rounded-xl overflow-hidden">
                <img
                  src={profilePhoto}
                  alt="Okoro Emmanuel Onyedikachi"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(8,12,20,0.5) 0%, transparent 50%)' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* ── Text ── */}
          <div ref={textRef} className="flex flex-col gap-6">
            <h2 className="font-display font-bold text-chalk leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {richText(t('about.heading'))}
            </h2>
            <p className="text-muted leading-relaxed">{richText(t('about.p1'))}</p>
            <p className="text-muted leading-relaxed">{richText(t('about.p2'))}</p>
            <p className="text-muted leading-relaxed">{richText(t('about.p3'))}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {['TypeScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'React Native'].map((tag) => (
                <span key={tag} className="font-mono text-xs px-3 py-1 border border-steel text-muted rounded-full hover:border-signal hover:text-signal transition-colors duration-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {STAT_T_KEYS.map((key, i) => (
            <div key={key} className="flex flex-col items-center text-center p-6 rounded-xl border border-steel/50 bg-void/60 hover:border-signal/50 transition-colors duration-300">
              <span
                className="font-display font-bold text-phosphor mb-1"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
                ref={(el) => { if (el) statNumbersRef.current[i] = el; }}
              >
                {STAT_VALUES[i]}
              </span>
              <span className="font-mono text-xs text-muted text-center leading-snug">
                {t(`about.stats.${key}`)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
