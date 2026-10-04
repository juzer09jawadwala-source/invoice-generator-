"use client";

import React, { useRef, useState, forwardRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface CreepyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  coverClassName?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

type Coords = {
  x: number;
  y: number;
};

export const CreepyButton = forwardRef<HTMLButtonElement, CreepyButtonProps>(
  (
    {
      children,
      className,
      coverClassName,
      variant = "default",
      size = "default",
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const eyesRef = useRef<HTMLSpanElement>(null);
    const [eyeCoords, setEyeCoords] = useState<Coords>({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const updateEyes = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      const userEvent =
        "touches" in e ? (e as React.TouchEvent).touches[0] : (e as React.MouseEvent);

      if (!eyesRef.current) return;

      const eyesRect = eyesRef.current.getBoundingClientRect();
      const eyesCenter = {
        x: eyesRect.left + eyesRect.width / 2,
        y: eyesRect.top + eyesRect.height / 2,
      };

      const cursor = {
        x: userEvent.clientX,
        y: userEvent.clientY,
      };

      const dx = cursor.x - eyesCenter.x;
      const dy = cursor.y - eyesCenter.y;
      const angle = Math.atan2(-dy, dx) + Math.PI / 2;

      const visionRangeX = 180;
      const visionRangeY = 75;
      const distance = Math.hypot(dx, dy);

      const x = (Math.sin(angle) * Math.min(distance, visionRangeX)) / visionRangeX;
      const y = (Math.cos(angle) * Math.min(distance, visionRangeY)) / visionRangeY;

      setEyeCoords({ x, y });
    };

    const resetEyes = () => {
      setEyeCoords({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const pupilStyle = {
      transform: `translate(calc(-50% + ${eyeCoords.x * 50}%), calc(-50% + ${eyeCoords.y * 50}%))`,
    };

    const variantCoverStyles: Record<string, string> = {
      default:
        "bg-gradient-to-r from-off-white via-light-gray to-off-white text-white border border-off-white/25 shadow-md shadow-off-white/30",
      destructive:
        "bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white border border-light-gray/40 shadow-md shadow-red-600/30",
      outline:
        "bg-deep-graphite text-off-white border border-off-white/25 hover:border-off-white/60",
      secondary:
        "bg-deep-graphite text-off-white border border-off-white/35 hover:border-off-white/70",
      ghost:
        "bg-deep-graphite/60 text-light-gray hover:text-white border border-transparent",
      link:
        "bg-transparent text-off-white underline",
    };

    const sizeStyles: Record<string, { container: string; cover: string; placeholder: string }> = {
      sm: {
        container: "min-w-[6.5em] text-xs h-8 rounded-lg",
        cover: "px-3 py-1.5 rounded-lg text-xs font-semibold",
        placeholder: "px-3 py-1.5 text-xs font-semibold min-w-[6.5em]",
      },
      default: {
        container: "min-w-[8em] text-xs sm:text-sm h-9 sm:h-10 rounded-xl",
        cover: "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide",
        placeholder: "px-4 py-2 text-xs sm:text-sm font-bold tracking-wide min-w-[8em]",
      },
      lg: {
        container: "min-w-[9.5em] text-sm sm:text-base h-11 sm:h-12 rounded-2xl",
        cover: "px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold tracking-wide",
        placeholder: "px-5 py-2.5 text-sm sm:text-base font-extrabold tracking-wide min-w-[9.5em]",
      },
      icon: {
        container: "w-8 h-8 sm:w-9 sm:h-9 min-w-0 p-0 rounded-lg",
        cover: "p-0 w-full h-full rounded-lg flex items-center justify-center",
        placeholder: "w-8 h-8 sm:w-9 sm:h-9 min-w-0 p-0",
      },
    };

    const currentSize = sizeStyles[size] || sizeStyles.default;

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center bg-black border border-off-white/15 outline-none select-none group tap-highlight-transparent overflow-visible transition-opacity",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-off-white",
          currentSize.container,
          className
        )}
        onClick={onClick}
        onMouseMove={(e) => {
          updateEyes(e);
          if (!disabled) setIsHovered(true);
        }}
        onTouchMove={updateEyes}
        onMouseLeave={resetEyes}
        onFocus={() => {
          if (!disabled) setIsHovered(true);
        }}
        onBlur={() => setIsHovered(false)}
        {...props}
      >
        {/* Animated Eyes Container Peeking from the Base Socket */}
        <span
          ref={eyesRef}
          className="absolute flex items-center gap-[0.3em] right-[0.75em] bottom-[0.45em] h-[0.75em] z-0 pointer-events-none select-none"
        >
          {/* Left Eye */}
          <motion.span
            className="relative w-[0.7em] h-[0.7em] bg-white rounded-full overflow-hidden shadow-inner"
            animate={{ scaleY: [1, 1, 0.05, 1] }}
            transition={{
              duration: 3.2,
              times: [0, 0.92, 0.96, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="absolute top-1/2 left-1/2 w-[0.36em] h-[0.36em] bg-black rounded-full transition-transform duration-75 ease-out shadow-sm"
              style={pupilStyle}
            />
          </motion.span>

          {/* Right Eye */}
          <motion.span
            className="relative w-[0.7em] h-[0.7em] bg-white rounded-full overflow-hidden shadow-inner"
            animate={{ scaleY: [1, 1, 0.05, 1] }}
            transition={{
              duration: 3.2,
              times: [0, 0.92, 0.96, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              className="absolute top-1/2 left-1/2 w-[0.36em] h-[0.36em] bg-black rounded-full transition-transform duration-75 ease-out shadow-sm"
              style={pupilStyle}
            />
          </motion.span>
        </span>

        {/* Tilting Button Cover */}
        <motion.span
          className={cn(
            "absolute inset-0 block flex items-center justify-center gap-2",
            "origin-[1.25em_50%]",
            variantCoverStyles[variant] || variantCoverStyles.default,
            currentSize.cover,
            coverClassName
          )}
          animate={{
            rotate: isHovered && !disabled ? -11 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 22,
            mass: 0.75,
          }}
        >
          {children}
        </motion.span>

        {/* Layout placeholder maintaining width and height */}
        <span className={cn("block opacity-0 flex items-center justify-center gap-2", currentSize.placeholder)}>
          {children}
        </span>
      </button>
    );
  }
);

CreepyButton.displayName = "CreepyButton";

export default CreepyButton;
