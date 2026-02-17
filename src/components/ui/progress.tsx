import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  showLabel?: boolean;
};

export const Progress = ({ value, max = 100, className, trackClassName, fillClassName, showLabel }: Props) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'h-2 w-full overflow-hidden rounded-full bg-[var(--color-line)]/70',
          trackClassName,
        )}
      >
        <div
          className={cn('h-full rounded-full bg-[var(--color-brand)] transition-[width] duration-500 ease-out', fillClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <div className="mt-1 text-[10px] text-[var(--color-muted)]">{Math.round(pct)}%</div>
      ) : null}
    </div>
  );
};

export const Ring = ({ value, max, size = 76, stroke = 8, label }: { value: number; max: number; size?: number; stroke?: number; label?: React.ReactNode }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const dash = c * pct;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label}
      </div>
    </div>
  );
};
