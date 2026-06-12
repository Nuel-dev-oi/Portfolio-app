import { useRef, useEffect, useState } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import { NodeGraph } from '@components/NodeGraph';
import { AnimatedText } from '@components/AnimatedText';
import profilePhoto from '@assets/emmanuel2.jpeg';

function ScrollCue({ label }: { label: string }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="font-mono text-xs text-muted tracking-widest uppercase">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-muted">
        <path d="M2 5l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Hero() {
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  const [nameComplete, setNameComplete] = useState(false);
  const { t } = useT();

  // After name finishes — reveal everything else + photo
  useEffect(() => {
    if (!nameComplete) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.3')
        .fromTo(
          ctasRef.current ? Array.from(ctasRef.current.children) : [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.12 },
          '-=0.25',
        )
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.1');

      // Photo slides in from the right, independent of the text timeline
      gsap.fromTo(
        photoRef.current,
        { x: 80, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.2 },
      );
    });

    return () => ctx.revert();
  }, [nameComplete]);

  // Reduced-motion: show everything instantly
  useEffect(() => {
    if (!prefersReducedMotion) return;
    [subtitleRef, taglineRef, ctasRef, scrollCueRef, photoRef].forEach((ref) => {
      if (ref.current) {
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'none';
      }
    });
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-void w-full"
      style={{ backgroundColor: '#04070f' }}
    >
      <NodeGraph />

      {/* Gradient overlay — heavier on the right so photo doesn't fight the canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 35% 50%, rgba(8,12,20,0.35) 0%, rgba(8,12,20,0.75) 55%, rgba(8,12,20,0.97) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Extra vignette for mobile — darkens edges so text is always legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,12,20,0.55) 0%, transparent 20%, transparent 75%, rgba(8,12,20,0.7) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Two-column layout: text left, photo right */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* minmax(0,1fr) — plain 1fr has min-width:auto, letting long text
            push the column under the photo instead of shrinking */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-12 items-center">

          {/* ── Left: text ── */}
          <div className="flex flex-col items-start text-left min-w-0">
            {/* Eyebrow */}
            <p
              ref={subtitleRef}
              className="font-mono text-signal text-xs tracking-widest uppercase mb-6"
              style={{ opacity: 0 }}
            >
              {t('hero.eyebrow')}
            </p>

            {/* Name. Column width at lg ≈ 588px, xl ≈ 676px.
                Syne Bold ≈ 0.58em/char → 17 chars fits up to ~3.6rem at lg.
                3.4rem cap leaves margin; wraps between words below that. */}
            <h1 className="font-display font-extrabold leading-[1.05] tracking-tight w-full">
              <span
                className="block text-chalk w-full"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 3.4rem)' }}
              >
                <AnimatedText text="OKORO" delay={0.3} stagger={0.036} wave />
              </span>
              <span
                className="block text-chalk w-full whitespace-nowrap"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 3.4rem)' }}
              >
                <AnimatedText text="ONYEDIKACHI" delay={0.55} stagger={0.036} wave />
              </span>
              <span
                className="block w-full"
                style={{
                  fontSize: 'clamp(1.5rem, 5vw, 3.4rem)',
                  background: 'linear-gradient(90deg, #e8edf5 0%, #3b82f6 55%, #60efbc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <AnimatedText
                  text="EMMANUEL"
                  delay={0.85}
                  stagger={0.045}
                  wave
                  onComplete={() => setNameComplete(true)}
                />
              </span>
            </h1>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="mt-6 text-muted text-base md:text-lg max-w-lg leading-relaxed"
              style={{ opacity: 0 }}
            >
              {t('hero.tagline').split(/<strong>|<\/strong>|<signal>|<\/signal>/).map((part, i) => {
                if (i === 1) return <span key={i} className="text-chalk font-medium">{part}</span>;
                if (i === 3) return <span key={i} className="text-signal font-medium">{part}</span>;
                return part;
              })}
            </p>

            {/* CTAs */}
            <div
              ref={ctasRef}
              className="mt-8 flex flex-col sm:flex-row items-start gap-4"
            >
              <a
                href="#projects"
                onClick={(e) => handleNavClick(e, '#projects')}
                className="px-7 py-3 bg-signal text-void font-mono font-medium text-sm rounded hover:bg-phosphor transition-colors duration-200 w-full sm:w-auto text-center"
                style={{ opacity: 0 }}
              >
                {t('hero.cta_work')}
              </a>
              <a
                href="/Okoro_Emmanuel_CV_Enhanced.pdf"
                download
                className="px-7 py-3 border border-steel text-chalk font-mono text-sm rounded hover:border-signal hover:text-signal transition-all duration-200 w-full sm:w-auto text-center"
                style={{ opacity: 0 }}
              >
                {t('hero.cta_cv')}
              </a>
            </div>
          </div>

          {/* ── Right: photo ── */}
          <div
            ref={photoRef}
            className="hidden lg:flex justify-center items-center"
            style={{ opacity: 0 }}
          >
            <div className="relative">
              {/* Phosphor glow ring behind the photo */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(96,239,188,0.12) 0%, transparent 70%)',
                  transform: 'scale(1.15)',
                }}
                aria-hidden="true"
              />

              {/* Decorative corner brackets */}
              <div className="absolute -top-3 -left-3 w-7 h-7 border-t-2 border-l-2 border-phosphor rounded-tl-md" aria-hidden="true" />
              <div className="absolute -top-3 -right-3 w-7 h-7 border-t-2 border-r-2 border-phosphor rounded-tr-md" aria-hidden="true" />
              <div className="absolute -bottom-3 -left-3 w-7 h-7 border-b-2 border-l-2 border-phosphor rounded-bl-md" aria-hidden="true" />
              <div className="absolute -bottom-3 -right-3 w-7 h-7 border-b-2 border-r-2 border-phosphor rounded-br-md" aria-hidden="true" />

              {/* Offset shadow border */}
              <div
                className="absolute -bottom-3 -right-3 w-full h-full border border-signal/30 rounded-2xl"
                aria-hidden="true"
              />

              {/* Photo */}
              <div className="w-72 xl:w-80 rounded-2xl overflow-hidden border border-steel/60">
                <img
                  src={profilePhoto}
                  alt="Okoro Emmanuel Onyedikachi"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div ref={scrollCueRef} style={{ opacity: 0 }}>
        <ScrollCue label={t('hero.scroll')} />
      </div>
    </section>
  );
}
