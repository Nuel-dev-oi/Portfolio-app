import { useState, useEffect } from 'react';

// Returns true once the page has scrolled past `threshold` pixels
export function useScrolled(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    handler(); // run once on mount
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}
