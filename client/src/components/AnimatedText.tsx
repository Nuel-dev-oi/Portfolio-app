import { useRef, useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  wave?: boolean;
  onComplete?: () => void;
}

export function AnimatedText({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  wave = false,
  onComplete,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = Array.from(container.querySelectorAll<HTMLElement>('[data-char]'));

    if (prefersReducedMotion) {
      chars.forEach((c) => {
        c.style.transform = 'none';
        c.style.opacity = '1';
      });
      onComplete?.();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger,
          delay,
          ease: 'power3.out',
          onComplete: () => {
            onComplete?.();

            if (!wave) return;

            gsap.to(chars, {
              y: -10,
              duration: 0.4,
              ease: 'sine.inOut',
              stagger: { each: 0.06, repeat: -1, yoyo: true },
              delay: 0.05,
            });
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [text, delay, stagger, wave, onComplete]);

  // Split on words so spaces are rendered as gaps between word groups,
  // not as individual inline-block spans that cause wrapping or trailing space.
  const words = text.split(' ');

  return (
    // No nowrap: words are inline-block groups, so wrapping happens cleanly
    // between words, never mid-word. No vertical padding — the wave overshoot
    // renders fine because no ancestor clips overflow.
    <span
      ref={containerRef}
      className={`block w-full ${className}`}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block">
          {/* Each letter in the word */}
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block"
              aria-hidden="true"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
          {/* Space between words — not a data-char so wave skips it,
              rendered as a normal inline gap, no trailing space on last word */}
          {wi < words.length - 1 && (
            <span className="inline-block" aria-hidden="true">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
