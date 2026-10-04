"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface StackedSectionProps {
  children: React.ReactNode;
  index: number;
  isLast?: boolean;
}

export function StackedSection({ children, index, isLast = false }: StackedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [topOffset, setTopOffset] = useState(0);

  const [scrollOffset, setScrollOffset] = useState<["end bottom" | "start start", "end top"]>(["start start", "end top"]);

  useEffect(() => {
    const updateOffset = () => {
      if (sectionRef.current) {
        const h = sectionRef.current.offsetHeight;
        const wh = window.innerHeight;
        if (h > wh) {
          setTopOffset(wh - h);
          setScrollOffset(["end bottom", "end top"]);
        } else {
          setTopOffset(0);
          setScrollOffset(["start start", "end top"]);
        }
      }
    };
    
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    window.addEventListener('resize', updateOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: scrollOffset
  });

  // Scale down subtly for a premium depth effect, originating from top center
  // to avoid gaps at the top while pinned.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  
  // Fade in a black overlay to create depth/shadow under the incoming section.
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.65]);

  return (
    <motion.section
      ref={sectionRef}
      className="w-full relative"
      style={{
        position: 'sticky',
        top: topOffset,
        zIndex: index,
        // Optional minor performance optimization hints
        willChange: "transform"
      }}
    >
      <motion.div
        style={isLast ? {} : { scale, transformOrigin: "center top" }}
        className={`w-full h-full bg-black relative ${
          index > 0 
            ? 'rounded-t-[24px] sm:rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/10' 
            : ''
        } overflow-hidden`}
      >
        {children}

        {/* Darkening overlay for depth effect */}
        {!isLast && (
          <motion.div 
            className="absolute inset-0 bg-black pointer-events-none z-50"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </motion.div>
    </motion.section>
  );
}
