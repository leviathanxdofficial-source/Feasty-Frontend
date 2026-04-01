import * as React from 'react';
import { logApi, type LogEntry } from '@/lib/api';
import { ymd } from '@/lib/date';
import { MealSection } from '@/components/diary-components/MealSection';
import { DateNav } from '@/components/diary-components/DateNav';
import { Card } from '@/components/ui/card';

const MEALS = [
  { id: 'breakfast' as const, emoji: '🌅' },
  { id: 'lunch' as const, emoji: '🥗' },
  { id: 'dinner' as const, emoji: '🍝' },
  { id: 'snack' as const, emoji: '🍪' },
];

export const DiaryPage: React.FC = () => {
  const [date, setDate] = React.useState(ymd());
  const [entries, setEntries] = React.useState<LogEntry[]>([]);

  const load = React.useCallback(async () => {
    const r = await logApi.day(date);
    setEntries(r);
  }, [date]);

  React.useEffect(() => {
    load();
  }, [load]);

  const byMeal = (m: string) => entries.filter((e) => e.meal === m);
  const total = entries.reduce((s, e) => s + e.kcal, 0);

  return (
    <div className="space-y-3">
      <DateNav date={date} onChange={setDate} />
      <Card className="flex items-center justify-between py-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">today total</div>
          <div className="font-display text-2xl font-bold">{Math.round(total)} kcal</div>
        </div>
        <div className="text-right text-[11px] text-[var(--color-muted)]">
          {entries.length} items logged
        </div>
      </Card>
      {MEALS.map((m) => (
        <MealSection
          key={m.id}
          meal={m.id}
          emoji={m.emoji}
          date={date}
          entries={byMeal(m.id)}
          onChange={load}
        />
      ))}
    </div>
  );
};
