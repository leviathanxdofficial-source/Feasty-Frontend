import * as React from 'react';
import { Trash2, Flame, Timer, Footprints } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { exerciseApi, type WorkoutEntry } from '@/lib/api';
import { toast } from 'sonner';

export const WorkoutList: React.FC<{ entries: WorkoutEntry[]; onChange: () => void }> = ({ entries, onChange }) => {
  const remove = async (id: string) => {
    try {
      await exerciseApi.removeLog(id);
      onChange();
    } catch {
      toast.error('couldnt remove');
    }
  };
  if (entries.length === 0) {
    return (
      <Card>
        <div className="text-xs text-[var(--color-muted)] text-center italic py-2">no workouts today, rest is good too 💤</div>
      </Card>
    );
  }
  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li key={e._id}>
          <Card className="group p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{e.name}</div>
                <div className="mt-0.5 flex flex-wrap gap-2 text-[11px] text-[var(--color-muted)]">
                  {e.durationMin > 0 ? (
                    <span className="inline-flex items-center gap-1"><Timer className="size-3" />{e.durationMin}min</span>
                  ) : null}
                  {e.steps > 0 ? (
                    <span className="inline-flex items-center gap-1"><Footprints className="size-3" />{e.steps} steps</span>
                  ) : null}
                  {e.sets?.length > 0 ? <span>{e.sets.length} sets</span> : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[var(--color-warn)] text-sm font-semibold">
                  <Flame className="size-3.5" />{e.caloriesBurned}
                </span>
                <button
                  className="opacity-0 group-hover:opacity-100 transition text-[var(--color-muted)] hover:text-[var(--color-danger)]"
                  onClick={() => remove(e._id)}
                  aria-label="remove"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
};
