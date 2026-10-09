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


      {/* Monochrome Dotted Wave Field Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url(/bg-wave.png)' }}
      />
    </div>
  );
}
