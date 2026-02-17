import * as React from 'react';
import * as RTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = RTabs.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RTabs.List>,
  React.ComponentPropsWithoutRef<typeof RTabs.List>
>(({ className, ...p }, ref) => (
  <RTabs.List
    ref={ref}
    className={cn(
      'inline-flex h-10 rounded-2xl bg-[var(--color-line)]/50 p-1 text-sm gap-1',
      className,
    )}
    {...p}
  />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RTabs.Trigger>
>(({ className, ...p }, ref) => (
  <RTabs.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-3 font-medium text-[var(--color-muted)] transition-all data-[state=active]:bg-[var(--color-bg-elev)] data-[state=active]:text-[var(--color-text)] data-[state=active]:shadow-sm',
      className,
    )}
    {...p}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = RTabs.Content;
