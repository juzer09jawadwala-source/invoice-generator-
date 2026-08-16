import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-block">
        <select
          ref={ref}
          className={cn(
            'h-8 px-3 pr-8 rounded-lg dark-input text-xs appearance-none cursor-pointer text-foreground bg-card focus:border-ring focus:ring-1 focus:ring-ring',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = 'Select';
