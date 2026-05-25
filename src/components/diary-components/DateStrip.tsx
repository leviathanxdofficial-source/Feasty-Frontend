import * as React from 'react';
import { ymd, addDays, parseYmd } from '@/lib/date';
import { cn } from '@/lib/utils';

type Props = { date: string; onChange: (d: string) => void; days?: number };

export const DateStrip: React.FC<Props> = ({ date, onChange, days = 7 }) => {
  const today = new Date();
  const cells = Array.from({ length: days }, (_, i) => {
    const d = addDays(today, -(days - 1 - i));
    return d;
  });

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-thin px-0.5">
      {cells.map((d) => {
        const cur = ymd(d);
        const isSel = cur === date;
        const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
        return (
          <button
            key={cur}
            onClick={() => onChange(cur)}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border min-w-[44px] py-1.5 transition',
              isSel
                ? 'bg-[var(--color-brand)] text-white border-transparent shadow-md'
                : 'border-[var(--color-line)] hover:bg-[var(--color-line)]/30',
            )}
          >
            <span className="text-[10px] uppercase opacity-80">{dow}</span>
            <span className="text-sm font-semibold leading-none mt-0.5">{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};
