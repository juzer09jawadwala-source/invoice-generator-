import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary/20 text-primary-foreground border-primary/30',
    secondary: 'bg-white/10 text-white border-white/20',
    destructive: 'bg-graphite/15 text-light-gray border-graphite/30',
    outline: 'border-border text-foreground bg-white/[0.02]',
    success: 'bg-graphite/15 text-emerald-400 border-graphite/30',
    warning: 'bg-graphite/15 text-amber-300 border-graphite/30',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  );
}
