import * as React from 'react';
import { exerciseApi, type WorkoutEntry } from '@/lib/api';
import { ymd } from '@/lib/date';
import { DateNav } from '@/components/diary-components/DateNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ExerciseLogger } from '@/components/exercise-components/ExerciseLogger';
import { WorkoutList } from '@/components/exercise-components/WorkoutList';
import { Plus, Flame } from 'lucide-react';

export const ExercisePage: React.FC = () => {
  const [date, setDate] = React.useState(ymd());
  const [entries, setEntries] = React.useState<WorkoutEntry[]>([]);
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    const r = await exerciseApi.day(date);
    setEntries(r);
  }, [date]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalBurn = entries.reduce((s, e) => s + e.caloriesBurned, 0);
  const totalMin = entries.reduce((s, e) => s + e.durationMin, 0);
  const totalSteps = entries.reduce((s, e) => s + e.steps, 0);

  return (
    <div className="space-y-3">
      <DateNav date={date} onChange={setDate} />
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">burned today</div>
            <div className="font-display text-2xl font-bold inline-flex items-center gap-1">
              <Flame className="size-5 text-[var(--color-warn)]" />
              {totalBurn}
            </div>
            <div className="text-[11px] text-[var(--color-muted)]">{totalMin} min · {totalSteps} steps</div>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="solid"><Plus className="size-3.5" />add workout</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetTitle className="font-display text-base font-semibold">log a workout</SheetTitle>
              <ExerciseLogger date={date} onDone={() => { setOpen(false); load(); }} />
            </SheetContent>
          </Sheet>
        </div>
      </Card>
      <WorkoutList entries={entries} onChange={load} />
    </div>
  );
};
