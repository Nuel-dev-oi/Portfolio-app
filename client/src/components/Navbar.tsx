import { useRef, useEffect, useState } from 'react';
import { gsap } from '@lib/gsap';
import { useScrolled } from '@hooks/useScrolled';
import { useActiveSection } from '@hooks/useActiveSection';
import { useTheme } from '@hooks/useTheme';
import { useT } from '@lib/i18n';
import { HamburgerIcon } from './HamburgerIcon';
import { LangSwitcher } from './LangSwitcher';

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const NAV_HREFS = ['#about', '#skills', '#projects', '#experience', '#contact'] as const;
const NAV_KEYS  = ['about', 'skills', 'projects', 'experience', 'contact'] as const;
const SECTION_IDS = NAV_HREFS.map((h) => h.slice(1));

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const scrolled = useScrolled(20);
  const activeSection = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const themeToggleRef = useRef<HTMLButtonElement>(null);

  // ── Entrance animation on mount ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2 },
      )
        .fromTo(
          logoRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          '-=0.4',
        )
        .fromTo(
          linksRef.current ? Array.from(linksRef.current.children) : [],
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 },
          '-=0.3',
        )
        .fromTo(
          ctaRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4 },
          '-=0.2',
        );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ── Mobile menu GSAP slide ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.35, ease: 'power2.out' },
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    }
  }, [menuOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-md border-b border-steel/50 shadow-lg shadow-void/50'
          : 'bg-void/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          ref={logoRef}
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="font-display font-bold text-lg text-chalk tracking-tight hover:text-phosphor transition-colors duration-200"
        >
          EO<span className="text-signal">.</span>
        </a>

        {/* Desktop links */}
        <ul ref={linksRef} className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_HREFS.map((href, i) => {
            const isActive = activeSection === href.slice(1);
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`font-mono text-sm transition-colors duration-200 relative group ${
                    isActive ? 'text-phosphor' : 'text-muted hover:text-chalk'
                  }`}
                >
                  {t(`nav.${NAV_KEYS[i]}`)}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-phosphor transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop right-side controls */}
        <div className="hidden md:flex items-center gap-2">
          <LangSwitcher />
          <a
            ref={ctaRef}
            href="/Okoro_Emmanuel_CV_Updated.pdf"
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-signal text-signal font-mono text-sm rounded hover:bg-signal hover:text-void transition-all duration-200"
          >
            {t('nav.downloadCV')}
          </a>
        </div>

        {/* Theme toggle */}
        <button
          ref={themeToggleRef}
          onClick={() => {
            toggle();
            if (themeToggleRef.current) {
              gsap.fromTo(
                themeToggleRef.current,
                { rotate: 0, scale: 1 },
                { rotate: 360, scale: 1.2, duration: 0.45, ease: 'back.out(2)',
                  onComplete: () => gsap.set(themeToggleRef.current, { rotate: 0, scale: 1 }) },
              );
            }
          }}
          aria-label={theme === 'dark' ? t('nav.switchLight') : t('nav.switchDark')}
          className="p-2 rounded text-muted hover:text-chalk transition-colors duration-200"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-chalk hover:text-signal transition-colors duration-200 p-2 rounded bg-steel/30 backdrop-blur-sm"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden overflow-hidden bg-ink/95 backdrop-blur-md border-b border-steel/50"
        style={{ height: 0, opacity: 0 }}
      >
        <ul className="flex flex-col px-6 py-4 gap-4 list-none m-0 p-0">
          {NAV_HREFS.map((href, i) => {
            const isActive = activeSection === href.slice(1);
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`font-mono text-sm block py-2 transition-colors duration-200 ${
                    isActive ? 'text-phosphor' : 'text-muted hover:text-chalk'
                  }`}
                >
                  {t(`nav.${NAV_KEYS[i]}`)}
                </a>
              </li>
            );
          })}
          <li className="flex items-center gap-3 pt-1">
            <LangSwitcher />
          </li>
          <li>
            <a
              href="/Okoro_Emmanuel_CV_Updated.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 border border-signal text-signal font-mono text-sm rounded hover:bg-signal hover:text-void transition-all duration-200 mt-2"
            >
              {t('nav.downloadCV')}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
