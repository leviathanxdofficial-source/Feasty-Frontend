import * as React from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { addDays, parseYmd, ymd, fmtPretty } from '@/lib/date';
import { Button } from '@/components/ui/button';

export const DateNav: React.FC<{ date: string; onChange: (d: string) => void }> = ({ date, onChange }) => {
  const go = (n: number) => onChange(ymd(addDays(parseYmd(date), n)));
  const isFuture = parseYmd(date).getTime() > new Date().setHours(0, 0, 0, 0);
  return (
    <div className="flex items-center justify-between">
      <Button size="icon" variant="ghost" onClick={() => go(-1)} aria-label="previous day">
        <ChevronLeft className="size-4" />
      </Button>
      <div className="flex items-center gap-2">
        <CalendarDays className="size-3.5 text-[var(--color-muted)]" />
        <button
          onClick={() => onChange(ymd())}
          className="font-display text-sm font-semibold hover:underline underline-offset-2"
        >
          {fmtPretty(date)}
        </button>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => !isFuture && go(1)}
        aria-label="next day"
        disabled={isFuture}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};
