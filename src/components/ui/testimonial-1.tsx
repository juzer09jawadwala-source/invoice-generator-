import React, { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import {
  ArrowDown,
  ArrowUp,
  Tv,
  Triangle,
  ShoppingBag,
  Store,
  Sparkles,
  Users,
} from 'lucide-react';

interface StatItem {
  percentage: string;
  logoText: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isIncrease: boolean;
  logo?: string;
}

export default function Testimonial1() {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const stats: StatItem[] = [
    {
      percentage: '80%',
      label: 'manual payment tasks',
      isIncrease: false,
      logoText: 'NETFLIX',
      icon: Tv,
      logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=200&q=80',
    },
    {
      percentage: '30%',
      label: 'international fees',
      isIncrease: false,
      logoText: 'VERCEL',
      icon: Triangle,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    },
    {
      percentage: '25%',
      label: 'payment reconciliation',
      isIncrease: false,
      logoText: 'AMAZON',
      icon: ShoppingBag,
      logo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?auto=format&fit=crop&w=200&q=80',
    },
    {
      percentage: '$100K',
      label: 'saved per year',
      isIncrease: true,
      logoText: 'ALIBABA',
      icon: Store,
      logo: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="w-full py-10 sm:py-16 px-3 sm:px-6 md:px-8 lg:px-16 relative">
      <div className="max-w-6xl mx-auto">
        {/* Community Badge with warm editorial styling */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-white/[0.08] text-off-white border border-off-white/15 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-bold backdrop-blur-md shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-off-white" />
            <span>Our Community & Impact</span>
          </div>
        </div>

        {/* Main Heading with Interactive Tooltip Avatars */}
        <div className="text-center max-w-screen-xl mx-auto relative text-off-white">
          <h2 className="text-xl sm:text-3xl lg:text-5xl font-heading font-bold leading-snug sm:leading-tight text-off-white">
            We make it easy for
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-1.5 sm:mx-2 align-middle relative cursor-pointer">
                    <div className="relative overflow-hidden w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 origin-center transition-all duration-300 md:hover:w-36 rounded-full border-2 border-off-white shadow-lg shadow-off-white/30 hover:scale-105">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                        alt="Creative Director"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: 'center' }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-deep-graphite/95 text-off-white p-4 rounded-2xl shadow-2xl border border-off-white/20 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="mb-2 text-xs text-light-gray leading-relaxed">
                    "It's great to have a clear sense of where our studio revenue is going and be able to adjust terms instantly. The transparency is unmatched."
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-off-white/10 text-xs">
                    <span className="font-heading font-bold text-off-white">Elena Rostova</span>
                    <span className="text-[10px] text-soft-gray font-semibold">Studio Principal</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            companies and
          </h2>

          <h2 className="text-xl sm:text-3xl lg:text-5xl font-heading font-bold leading-snug sm:leading-tight mt-1 text-off-white">
            and their
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block mx-1.5 sm:mx-2 align-middle relative cursor-pointer">
                    <div className="relative overflow-hidden w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 origin-center transition-all duration-300 lg:hover:w-36 md:hover:w-24 rounded-full border-2 border-soft-gray shadow-lg shadow-soft-gray/25 hover:scale-105">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80"
                        alt="Operations Lead"
                        className="object-cover w-full h-full"
                        style={{ objectPosition: 'center' }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-xs bg-deep-graphite/95 text-off-white p-4 rounded-2xl shadow-2xl border border-off-white/20 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="mb-2 text-xs text-light-gray leading-relaxed">
                    "Client payments arrive on schedule without the awkward follow-ups. Our billable collection cycle dropped from 45 days to 14 days."
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-off-white/10 text-xs">
                    <span className="font-heading font-bold text-off-white">Marcus Chen</span>
                    <span className="text-[10px] text-soft-gray font-semibold">Head of Finance</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            teams to collaborate and
          </h2>

          <h2 className="text-xl sm:text-3xl lg:text-5xl font-heading font-black leading-snug sm:leading-tight mt-1 bg-gradient-to-r from-off-white via-soft-gray to-off-white bg-clip-text text-transparent">
            accelerate revenue settlement
          </h2>
        </div>

        {/* Stats Grid with Brand Logos and Flip Hover Transitions */}
        <div className="sm:flex grid grid-cols-2 gap-3 sm:gap-6 bg-deep-graphite/85 backdrop-blur-xl mt-8 sm:mt-10 w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 border rounded-3xl border-off-white/15 shadow-2xl">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isToggled = hoveredImage === stat.logoText;

            return (
              <div
                key={stat.label}
                onClick={() => setHoveredImage(isToggled ? null : stat.logoText)}
                className="flex-1 flex gap-2 sm:gap-4 pl-1 sm:pl-8 relative min-h-[84px] sm:min-h-[90px] items-center cursor-pointer sm:cursor-default"
                title="Tap or hover to view metric"
              >
                {index !== 0 && (
                  <div className="hidden sm:block w-px h-10 border-l border-dashed border-off-white/20 absolute left-0" />
                )}
                <div className="w-full h-full group flex flex-col justify-center relative">
                  {/* Default Brand State */}
                  <div
                    className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ease-out ${
                      isToggled
                        ? 'opacity-0 -translate-y-6 sm:group-hover:opacity-0 sm:group-hover:-translate-y-6'
                        : 'opacity-100 translate-y-0 sm:group-hover:opacity-0 sm:group-hover:-translate-y-6'
                    }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/[0.06] border border-off-white/15 flex items-center justify-center text-light-gray group-hover:text-off-white">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="font-heading font-bold text-[10px] sm:text-xs tracking-wider text-light-gray uppercase">
                      {stat.logoText}
                    </span>
                  </div>

                  {/* Hover Stat Metric State */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center w-full transition-all duration-300 ease-out pointer-events-none ${
                      isToggled
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-6 sm:group-hover:opacity-100 sm:group-hover:translate-y-0'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {stat.isIncrease ? (
                        <ArrowUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-off-white" />
                      )}
                      <span className="text-lg sm:text-2xl md:text-3xl font-heading font-black text-off-white tabular-nums">
                        {stat.percentage}
                      </span>
                    </div>
                    <p className="text-light-gray text-[9px] sm:text-xs text-center font-medium capitalize mt-0.5 line-clamp-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

