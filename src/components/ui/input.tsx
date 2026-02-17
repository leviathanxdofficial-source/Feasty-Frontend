import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-4 text-sm placeholder:text-[var(--color-muted)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)]/60',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-4 py-2 text-sm placeholder:text-[var(--color-muted)] outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 focus:border-[var(--color-brand)]/60',
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';
