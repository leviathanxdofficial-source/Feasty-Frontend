import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('card-soft p-4', className)} {...props} />
  ),
);
Card.displayName = 'Card';

export const CardHeader = ({ children, className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-3 flex items-center justify-between gap-2', className)} {...p}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('font-display text-sm font-semibold tracking-tight', className)} {...p}>
    {children}
  </h3>
);

export const CardDesc = ({ children, className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-xs text-[var(--color-muted)]', className)} {...p}>
    {children}
  </p>
);
