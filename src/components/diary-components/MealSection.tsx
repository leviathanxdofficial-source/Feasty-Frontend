import * as React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { FoodSearch } from './FoodSearch';
import { logApi, type LogEntry } from '@/lib/api';
import { toast } from 'sonner';

type Props = {
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  entries: LogEntry[];
  emoji: string;
  onChange: () => void;
};

export const MealSection: React.FC<Props> = ({ meal, date, entries, emoji, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const total = entries.reduce((s, e) => s + e.kcal, 0);

  const remove = async (id: string) => {
    try {
      await logApi.remove(id);
      onChange();
    } catch {
      toast.error('couldnt remove');
    }
  };

  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          <span className="font-display font-semibold capitalize">{meal}</span>
          <span className="text-xs text-[var(--color-muted)]">· {Math.round(total)} kcal</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="soft" aria-label={`add to ${meal}`}>
              <Plus className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetTitle className="font-display text-base font-semibold">
              add to {meal}
            </SheetTitle>
            <FoodSearch
              onPick={async (food, servings) => {
                try {
                  await logApi.add({ date, meal, foodId: food._id, servings });
                  onChange();
                  setOpen(false);
                  toast.success(`logged ${food.name}`);
                } catch {
                  toast.error('save failed');
                }
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      {entries.length === 0 ? (
        <div className="text-xs text-[var(--color-muted)] py-2 text-center italic">nothing yet :(</div>
      ) : (
        <ul className="space-y-1">
          {entries.map((e) => (
            <li key={e._id} className="group flex items-center justify-between rounded-xl px-2 py-1.5 hover:bg-[var(--color-line)]/30">
              <div className="min-w-0">
                <div className="text-sm truncate">{e.name}</div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  {e.servings} × {e.servingUnit} · P{Math.round(e.protein)} C{Math.round(e.carbs)} F{Math.round(e.fat)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{Math.round(e.kcal)}</span>
                <button
                  className="opacity-0 group-hover:opacity-100 transition text-[var(--color-muted)] hover:text-[var(--color-danger)]"
                  onClick={() => remove(e._id)}
                  aria-label="remove"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
