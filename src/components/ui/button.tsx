import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'soft' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-xl',
  md: 'h-10 px-4 text-sm rounded-2xl',
  lg: 'h-12 px-6 text-base rounded-2xl',
  icon: 'h-9 w-9 rounded-xl',
};

const variants: Record<Variant, string> = {
  solid:
    'bg-[var(--color-brand)] text-white hover:opacity-90 active:translate-y-px shadow-[var(--shadow-soft)]',
  soft: 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:brightness-95',
  ghost: 'bg-transparent hover:bg-[var(--color-line)]/60 text-[var(--color-text)]',
  outline:
    'bg-transparent border border-[var(--color-line)] hover:bg-[var(--color-line)]/40 text-[var(--color-text)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
