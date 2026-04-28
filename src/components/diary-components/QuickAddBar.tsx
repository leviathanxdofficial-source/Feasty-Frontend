import * as React from 'react';
import { foodApi, logApi, type Food } from '@/lib/api';
import { Pill } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type Props = { date: string; meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'; onAdd: () => void };

export const QuickAddBar: React.FC<Props> = ({ date, meal, onAdd }) => {
  const [foods, setFoods] = React.useState<Food[]>([]);
  React.useEffect(() => {
    foodApi.favorites().then(setFoods).catch(() => undefined);
  }, []);

  if (foods.length === 0) return null;

  const add = async (f: Food) => {
    try {
      await logApi.add({ date, meal, foodId: f._id, servings: 1 });
      toast.success(`+${f.name}`);
      onAdd();
    } catch {
      toast.error('couldnt add');
    }
  };

  return (
    <Card className="p-2">
      <CardTitle className="text-xs text-[var(--color-muted)]">quick add</CardTitle>
      <div className="mt-1 flex flex-wrap gap-1">
        {foods.slice(0, 8).map((f) => (
          <button key={f._id} onClick={() => add(f)}>
            <Pill variant="brand" className="hover:brightness-95">
              {f.name} · {f.kcal}
            </Pill>
          </button>
        ))}
      </div>
    </Card>
  );
};
