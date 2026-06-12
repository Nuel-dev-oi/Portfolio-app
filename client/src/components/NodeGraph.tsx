import { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '@lib/gsap';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface NodeGraphProps {
  className?: string;
}

const NODE_COUNT_DESKTOP = 55;
const NODE_COUNT_MOBILE = 28;
const MAX_LINK_DISTANCE = 140;
const MOUSE_RADIUS = 120;
const MOUSE_FORCE = 0.012;

export function NodeGraph({ className = '' }: NodeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store mouse position in a ref — no re-renders needed
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const nodeCount = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;

    // ── Sizing ────────────────────────────────────────────────────────────────
    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // ── Spawn nodes at random positions ──────────────────────────────────────
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      // Reduced-motion: zero velocity — nodes stay still
      vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
      vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 1,
    }));

    // ── Mouse tracking (desktop only) ────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (!isMobile && !prefersReducedMotion) {
      canvas.addEventListener('mousemove', onMouseMove);
    }

    // ── Draw loop ─────────────────────────────────────────────────────────────
    let rafId: number;

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      nodes.forEach((node) => {
        // Gentle mouse attraction
        const dx = mouse.current.x - node.x;
        const dy = mouse.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          node.vx += dx * MOUSE_FORCE;
          node.vy += dy * MOUSE_FORCE;
        }

        // Dampen velocity so nodes don't accelerate forever
        node.vx *= 0.98;
        node.vy *= 0.98;

        node.x += node.vx;
        node.y += node.vy;

        // Wrap around canvas edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;
      });

      // Read live CSS tokens so the graph follows the active theme
      const style   = getComputedStyle(document.documentElement);
      const signal  = style.getPropertyValue('--color-signal').trim()  || '#3b82f6';
      const steel   = style.getPropertyValue('--color-steel').trim()   || '#1e2d45';
      const phosphor = style.getPropertyValue('--color-phosphor').trim() || '#60efbc';

      // Draw edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_LINK_DISTANCE) {
            const opacity = (1 - dist / MAX_LINK_DISTANCE) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = signal;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = steel;
        ctx.fill();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = phosphor;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
