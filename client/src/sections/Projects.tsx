import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import { projects } from '@lib/data';
import type { Project } from '@app-types/index';

// ── Icons (inline SVG — no extra dependency) ──────────────────────────────
function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ── Single project card ────────────────────────────────────────────────────
interface CardProps {
  project: Project;
  index: number;
  labelInProgress: string;
  labelGithub: string;
  labelLive: string;
  t: (key: string) => string;
}

function ProjectCard({ project, index, labelInProgress, labelGithub, labelLive, t }: CardProps) {
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
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            once: true,
          },
          delay: (index % 3) * 0.1, // stagger within row
        },
      );
    }, card);

    return () => ctx.revert();
  }, [index]);

  // Hover: subtle lift + border brightening (pure GSAP for smooth easing)
  function handleEnter() {
    if (prefersReducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -5,
      duration: 0.22,
      ease: 'power2.out',
    });
  }
  function handleLeave() {
    if (prefersReducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.28,
      ease: 'power2.inOut',
    });
  }

  const isFeatured = project.inProgress === true;

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative flex flex-col rounded-xl border bg-ink p-6
                  transition-colors duration-200 group
                  ${isFeatured
                    ? 'border-phosphor/30 hover:border-phosphor/60'
                    : 'border-steel/60 hover:border-signal/50'}`}
      style={{ opacity: 0 }}
    >
      {/* Featured glow for in-progress card */}
      {isFeatured && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(96,239,188,0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Card header ── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Folder / project glyph */}
        <span
          className={`font-mono text-2xl leading-none select-none
                      ${isFeatured ? 'text-phosphor' : 'text-signal'}`}
          aria-hidden="true"
        >
          {isFeatured ? '⬡' : '◈'}
        </span>

        {/* Link icons */}
        <div className="flex items-center gap-3 shrink-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labelGithub} ${t(project.titleKey)}`}
              className="text-muted hover:text-chalk transition-colors duration-150"
            >
              <GitHubIcon />
            </a>
          )}
          {project.live && project.live !== '#' && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labelLive} ${t(project.titleKey)}`}
              className="text-muted hover:text-signal transition-colors duration-150"
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>
      </div>

      {/* ── Title ── */}
      <h3
        className={`font-display font-bold text-chalk text-lg leading-snug mb-2
                    transition-colors duration-200
                    ${isFeatured ? 'group-hover:text-phosphor' : 'group-hover:text-signal'}`}
      >
        {t(project.titleKey)}
        {project.inProgress && (
          <span
            className="ml-2 align-middle inline-flex items-center px-2 py-0.5
                       rounded-full font-mono text-[10px] tracking-widest uppercase
                       bg-phosphor/10 text-phosphor border border-phosphor/30 shrink-0"
          >
            {labelInProgress}
          </span>
        )}
      </h3>

      {/* ── Description ── */}
      <p className="text-muted text-sm leading-relaxed flex-1 mb-5">
        {t(project.descriptionKey)}
      </p>

      {/* ── Stack pills ── */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2.5 py-1 rounded
                       bg-steel/30 text-muted border border-steel/50
                       hover:text-chalk hover:border-steel transition-colors duration-150"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

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
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 75%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 bg-void overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />

      <div className="max-w-6xl mx-auto px-6">

        {/* ── Heading ── */}
        <div ref={headingRef} style={{ opacity: 0, transform: 'translateY(32px)' }}>
          <p className="font-mono text-signal text-xs tracking-widest uppercase mb-3">
            {t('projects.eyebrow')}
          </p>
          <h2
            className="font-display font-extrabold text-chalk tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('projects.heading')}{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #60efbc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('projects.headingAccent')}
            </span>
          </h2>
          <p className="mt-3 text-muted text-base max-w-xl leading-relaxed">
            {t('projects.body')}
          </p>
        </div>

        {/* ── Card grid ── */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.titleKey}
              project={project}
              index={i}
              t={t}
              labelInProgress={t('projects.inProgress')}
              labelGithub={t('projects.ariaGithub')}
              labelLive={t('projects.ariaLive')}
            />
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="mt-10 font-mono text-muted text-xs tracking-wider text-center">
          {t('projects.moreOn')}{' '}
          <a
            href="https://github.com/Nuel-dev-oi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal hover:text-phosphor transition-colors duration-150 underline underline-offset-4"
          >
            {t('projects.githubHandle')}
          </a>
        </p>

      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-steel to-transparent" />
    </section>
  );
}
