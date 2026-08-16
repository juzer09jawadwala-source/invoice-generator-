import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  waveX: number;
  waveY: number;
  cursorX: number;
  cursorY: number;
  vx: number;
  vy: number;
}

export interface WavesProps {
  className?: string;
  strokeColor?: string;
  backgroundColor?: string;
  pointerSize?: number;
}

export function Waves({
  className = '',
  strokeColor = 'rgba(168, 85, 247, 0.35)',
  backgroundColor = 'transparent',
  pointerSize = 0.5,
}: WavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const noise2D = createNoise2D();

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse coordinates and kinematics
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
      speed: 0,
      angle: 0,
    };

    let lines: Point[][] = [];

    const initPoints = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      lines = [];
      const xGap = 32; // Optimized spacing for smooth 60-120fps performance
      const yGap = 28;

      const totalLines = Math.ceil((width + 120) / xGap);
      const totalPoints = Math.ceil((height + 60) / yGap);

      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i < totalLines; i++) {
        const points: Point[] = [];
        const x = xStart + xGap * i;

        for (let j = 0; j < totalPoints; j++) {
          const y = yStart + yGap * j;
          points.push({
            x,
            y,
            originX: x,
            originY: y,
            waveX: 0,
            waveY: 0,
            cursorX: 0,
            cursorY: 0,
            vx: 0,
            vy: 0,
          });
        }
        lines.push(points);
      }
    };

    initPoints();

    // Mouse & Touch tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      initPoints();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState !== 'hidden';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse interpolation
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      const dx = mouse.x - prevX;
      const dy = mouse.y - prevY;
      const dist = Math.hypot(dx, dy);
      mouse.speed += (dist - mouse.speed) * 0.15;
      mouse.speed = Math.min(mouse.speed, 80);
      mouse.angle = Math.atan2(dy, dx);

      // Update pointer glow position
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Prepare styling
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const timeFactor = currentTime * 0.001;

      // Update and draw lines
      for (let i = 0; i < lines.length; i++) {
        const points = lines[i];
        if (points.length < 2) continue;

        ctx.beginPath();

        for (let j = 0; j < points.length; j++) {
          const p = points[j];

          // Wave motion with simplex noise
          const n = noise2D(
            p.originX * 0.002 + timeFactor * 0.4,
            p.originY * 0.002 + timeFactor * 0.2
          );

          p.waveX = Math.cos(n * Math.PI) * 10;
          p.waveY = Math.sin(n * Math.PI) * 6;

          // Mouse disturbance
          const mdx = p.originX - mouse.x;
          const mdy = p.originY - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          const maxInfluence = 160;

          if (mdist < maxInfluence) {
            const factor = (1 - mdist / maxInfluence) * 0.8;
            p.vx += Math.cos(mouse.angle) * factor * mouse.speed * 0.04;
            p.vy += Math.sin(mouse.angle) * factor * mouse.speed * 0.04;
          }

          // Spring physics
          p.vx += (0 - p.cursorX) * 0.05;
          p.vy += (0 - p.cursorY) * 0.05;
          p.vx *= 0.90;
          p.vy *= 0.90;

          p.cursorX += p.vx;
          p.cursorY += p.vy;

          p.x = p.originX + p.waveX + p.cursorX;
          p.y = p.originY + p.waveY + p.cursorY;

          if (j === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }

        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [strokeColor]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div
        ref={pointerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${pointerSize}rem`,
          height: `${pointerSize}rem`,
          marginLeft: `-${pointerSize / 2}rem`,
          marginTop: `-${pointerSize / 2}rem`,
          background: strokeColor,
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.9), 0 0 40px rgba(45, 212, 191, 0.4)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
