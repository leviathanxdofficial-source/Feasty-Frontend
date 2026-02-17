import * as React from 'react';
import { cn } from '@/lib/utils';

export const Empty = ({
  icon,
  title,
  desc,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  desc?: string;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-col items-center justify-center gap-2 p-6 text-center', className)}>
    {icon ? <div className="text-3xl">{icon}</div> : null}
    <div className="font-display text-sm font-medium">{title}</div>
    {desc ? <div className="text-xs text-[var(--color-muted)]">{desc}</div> : null}
    {action}
  </div>
);
