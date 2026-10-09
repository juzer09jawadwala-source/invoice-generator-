import React from 'react';

export function ModelLogo({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ ...style, position: 'relative' }}>
      {/* @ts-ignore */}
      <model-viewer
        src="/noir-logo.glb"
        auto-rotate
        camera-controls={false}
        disable-zoom
        disable-pan
        interaction-prompt="none"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}
