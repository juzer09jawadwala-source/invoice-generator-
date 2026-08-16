import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

export function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('', className)} {...props} />;
}

export function PaginationPrevious({
  className,
  disabled,
  onClick,
  ...props
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={cn('gap-1 pl-2.5', className)}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Previous</span>
    </Button>
  );
}

export function PaginationNext({
  className,
  disabled,
  onClick,
  ...props
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={cn('gap-1 pr-2.5', className)}
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}
