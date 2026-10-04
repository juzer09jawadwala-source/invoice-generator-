import React from 'react';

/**
 * EditorialBackground
 * 
 * Generates the rich, warm terracotta / burnt-orange atmosphere inspired by the Pinterest reference:
 * - Base tones: #742317 (deep red/brown), #9F321F (primary terracotta), #B84427 (secondary burnt orange)
 * - Faint geometric editorial line art: dot matrices, concentric diamond targets, plus signs, chevrons, wavy lines
 * - Subtle paper grain / noise overlay
 * - Non-intrusive: strictly pointer-events-none, low opacity, high performance (pure SVG/CSS)
 */
export function EditorialBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-black"
    >
      {/* Subtle Noise / Paper Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay">
        <filter id="editorial-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#editorial-noise)" />
      </svg>

      {/* Geometric Editorial Vector Decorations Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.14 }}
      >
        <defs>
          {/* Dot Grid Pattern for Matrices */}
          <pattern id="dot-matrix-sm" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.25" fill="#F4E7C8" />
          </pattern>
          <pattern id="dot-matrix-lg" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#F4E7C8" />
          </pattern>
        </defs>

        {/* Top-Right Dotted Matrix Array (just like Pinterest reference) */}
        <g transform="translate(1100, 30)">
          <rect width="280" height="420" fill="url(#dot-matrix-sm)" opacity="0.6" />
        </g>

        {/* Top-Left Dotted Matrix Array */}
        <g transform="translate(40, 80)">
          <rect width="180" height="260" fill="url(#dot-matrix-sm)" opacity="0.45" />
        </g>

        {/* Center-Right Dotted Matrix */}
        <g transform="translate(1180, 520)">
          <rect width="260" height="380" fill="url(#dot-matrix-sm)" opacity="0.5" />
        </g>

        {/* Bottom-Left Dotted Matrix */}
        <g transform="translate(80, 720)">
          <rect width="240" height="320" fill="url(#dot-matrix-sm)" opacity="0.55" />
        </g>

        {/* Decorative Concentric Diamond / Target at Bottom-Left */}
        <g transform="translate(140, 880)" stroke="#F4E7C8" fill="none" strokeWidth="1.2" opacity="0.65">
          <rect x="-45" y="-45" width="90" height="90" rx="8" transform="rotate(45)" />
          <rect x="-32" y="-32" width="64" height="64" rx="6" transform="rotate(45)" />
          <rect x="-18" y="-18" width="36" height="36" rx="4" transform="rotate(45)" />
          <circle cx="0" cy="0" r="5" fill="#F4E7C8" />
        </g>

        {/* Decorative Concentric Diamond / Target at Middle-Right */}
        <g transform="translate(1320, 680)" stroke="#F4E7C8" fill="none" strokeWidth="1.2" opacity="0.55">
          <rect x="-55" y="-55" width="110" height="110" rx="10" transform="rotate(45)" />
          <rect x="-38" y="-38" width="76" height="76" rx="8" transform="rotate(45)" />
          <rect x="-22" y="-22" width="44" height="44" rx="5" transform="rotate(45)" />
          <circle cx="0" cy="0" r="6" fill="#F4E7C8" />
        </g>

        {/* Top-Center Plus Sign (+) from reference */}
        <g transform="translate(740, 100)" stroke="#F4E7C8" strokeWidth="1.5" opacity="0.55">
          <line x1="-24" y1="0" x2="24" y2="0" />
          <line x1="0" y1="-24" x2="0" y2="24" />
          {/* Subtle outline box */}
          <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#F4E7C8" strokeWidth="0.75" opacity="0.5" />
        </g>

        {/* Top-Right Chevrons (>>>) from reference */}
        <g transform="translate(1020, 220)" stroke="#F4E7C8" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M0 0 L10 10 L0 20" />
          <path d="M12 0 L22 10 L12 20" />
          <path d="M24 0 L34 10 L24 20" />
          <path d="M36 0 L46 10 L36 20" />
        </g>

        {/* Bottom-Center Chevrons (>>>) */}
        <g transform="translate(680, 840)" stroke="#F4E7C8" strokeWidth="1.5" fill="none" opacity="0.5">
          <path d="M0 0 L10 10 L0 20" />
          <path d="M12 0 L22 10 L12 20" />
          <path d="M24 0 L34 10 L24 20" />
          <path d="M36 0 L46 10 L36 20" />
        </g>

        {/* Top-Left Geometric Hex / Diamond */}
        <g transform="translate(110, 100)" stroke="#F4E7C8" fill="none" strokeWidth="1" opacity="0.5">
          <circle cx="0" cy="0" r="28" strokeDasharray="3 4" />
          <rect x="-18" y="-18" width="36" height="36" rx="4" transform="rotate(45)" />
        </g>

        {/* Elegant Wavy Editorial Lines (like in reference) */}
        <g stroke="#F4E7C8" fill="none" strokeWidth="1.2" opacity="0.45">
          <path d="M 450,140 Q 470,120 490,140 T 530,140 T 570,140 T 610,140" />
          <path d="M 720,920 Q 740,900 760,920 T 800,920 T 840,920 T 880,920" />
          <path d="M 1240,340 Q 1260,320 1280,340 T 1320,340 T 1360,340" />
        </g>

        {/* Small plus marks scattered throughout background */}
        {[
          { x: 320, y: 80 },
          { x: 920, y: 60 },
          { x: 1380, y: 180 },
          { x: 80, y: 480 },
          { x: 420, y: 760 },
          { x: 1040, y: 920 },
        ].map((pt, idx) => (
          <g key={idx} transform={`translate(${pt.x}, ${pt.y})`} stroke="#F4E7C8" strokeWidth="1" opacity="0.4">
            <line x1="-8" y1="0" x2="8" y2="0" />
            <line x1="0" y1="-8" x2="0" y2="8" />
          </g>
        ))}

        {/* Subtle Diagonal Section Accent Lines */}
        <line x1="-100" y1="350" x2="600" y2="1050" stroke="#F4E7C8" strokeWidth="0.75" strokeDasharray="6 8" opacity="0.2" />
        <line x1="1100" y1="-50" x2="1850" y2="700" stroke="#F4E7C8" strokeWidth="0.75" strokeDasharray="6 8" opacity="0.18" />
      </svg>
    </div>
  );
}
