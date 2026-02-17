import * as React from 'react';
import { cn } from '@/lib/utils';

type Opt = { value: string; label: string };

export const Select = ({
  value,
  onChange,
  options,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  className?: string;
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      'h-10 w-full appearance-none rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-3 pr-8 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30',
      className,
    )}
  >
    {placeholder ? <option value="">{placeholder}</option> : null}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
