interface HamburgerIconProps {
  open: boolean;
}

// Pure CSS animated hamburger → X toggle. No GSAP needed here — CSS
// transitions on SVG lines are perfectly sufficient and more performant
// for a simple 2-state toggle.
export function HamburgerIcon({ open }: HamburgerIconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      {/* Top line — slides up and rotates to form the X */}
      <line
        x1="3" y1="6" x2="21" y2="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-all duration-300"
        style={{
          transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        }}
      />
      {/* Middle line — fades out */}
      <line
        x1="3" y1="12" x2="21" y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-all duration-300"
        style={{ opacity: open ? 0 : 1 }}
      />
      {/* Bottom line — slides up and rotates to form the X */}
      <line
        x1="3" y1="18" x2="21" y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-all duration-300"
        style={{
          transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        }}
      />
    </svg>
  );
}
