import * as React from 'react';
import * as RSwitch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export const Switch = React.forwardRef<
  React.ElementRef<typeof RSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof RSwitch.Root>
>(({ className, ...p }, ref) => (
  <RSwitch.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors data-[state=checked]:bg-[var(--color-brand)] data-[state=unchecked]:bg-[var(--color-line)]',
      className,
    )}
    {...p}
  >
    <RSwitch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5" />
  </RSwitch.Root>
));
Switch.displayName = 'Switch';
