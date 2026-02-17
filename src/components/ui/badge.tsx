import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'brand' | 'accent' | 'info' | 'warn' | 'muted';

const variants: Record<Variant, string> = {
  brand: 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]',
  accent: 'bg-[color-mix(in_oklch,var(--color-accent)_18%,transparent)] text-[var(--color-accent)]',
  info: 'bg-[color-mix(in_oklch,var(--color-info)_18%,transparent)] text-[var(--color-info)]',
  warn: 'bg-[color-mix(in_oklch,var(--color-warn)_18%,transparent)] text-[var(--color-warn)]',
  muted: 'bg-[var(--color-line)] text-[var(--color-muted)]',
};

export const Pill = ({ children, variant = 'brand', className }: { children: React.ReactNode; variant?: Variant; className?: string }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium', variants[variant], className)}>
    {children}
  </span>
);
