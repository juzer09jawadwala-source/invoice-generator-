import React from 'react';
import { BackgroundRippleEffect } from './ui/background-ripple-effect';

/**
 * EditorialBackground
 * 
 * Includes the interactive background boxes ripple effect as requested.
 */
export function EditorialBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden select-none bg-black"
    >
      {/* Subtle Noise / Paper Grain Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay pointer-events-none z-10">
        <filter id="editorial-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#editorial-noise)" />
      </svg>

      {/* Ripple Effect Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundRippleEffect />
      </div>
    </div>
  );
}
