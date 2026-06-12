import { useRef, useEffect, useState } from 'react';
import { gsap, prefersReducedMotion } from '@lib/gsap';
import { useT } from '@lib/i18n';
import { drawGlobe, LAGOS } from '@lib/globe';

interface GlobeLoaderProps {
  // Fires when Lagos is found and the fade-out begins — mount the app here
  onFound: () => void;
  // Fires when the fade-out finishes — unmount the loader here
  onComplete: () => void;
}

// Rotation ends with Lagos facing front-center: lon + rotation = 0.
// Start two full spins back so the globe visibly searches before settling.
const TARGET_ROTATION = -LAGOS.lon;
const START_ROTATION = TARGET_ROTATION - 720;

export function GlobeLoader({ onFound, onComplete }: GlobeLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [found, setFound] = useState(false);
  const { t } = useT();

  useEffect(() => {
    if (prefersReducedMotion) {
      onFound();
      onComplete();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Scale for device pixel ratio so dots render crisp on retina screens
    const dpr = window.devicePixelRatio || 1;
    const size = canvas.offsetWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Animation state lives in a plain object — GSAP tweens it, rAF reads it
    const state = { rotation: START_ROTATION, ping: 0 };
    let isFound = false;
    let rafId: number;

    function render() {
      if (!ctx) return;
      drawGlobe(ctx, size, size, state.rotation, state.ping, isFound);
      rafId = requestAnimationFrame(render);
    }
    render();

    const tl = gsap.timeline();
    tl
      // Spin and decelerate into Lagos
      .to(state, { rotation: TARGET_ROTATION, duration: 2.8, ease: 'power3.inOut' })
      .add(() => {
        isFound = true;
        setFound(true);
      })
      // Ping pulses for a beat while the label shows
      .to(state, { ping: 1, duration: 1.5, ease: 'none' })
      .add(() => onFound())
      // Fade the whole overlay; app is mounting and animating beneath it
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete,
      });

    return () => {
      cancelAnimationFrame(rafId);
      tl.kill();
    };
  }, [onFound, onComplete]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 bg-void flex flex-col items-center justify-center"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-[min(70vw,400px)] h-[min(70vw,400px)]"
      />
      <p
        className={`font-mono text-xs tracking-widest uppercase mt-4 transition-colors duration-300 ${
          found ? 'text-phosphor' : 'text-muted'
        }`}
      >
        {found ? t('globe.found') : t('globe.locating')}
      </p>
    </div>
  );
}
