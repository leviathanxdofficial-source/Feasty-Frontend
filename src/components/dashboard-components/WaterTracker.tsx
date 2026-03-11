import * as React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { waterApi } from '@/lib/api';
import { fmtMl } from '@/lib/utils';
import { toast } from 'sonner';

type Props = { date: string; ml: number; target: number; onChange?: () => void };

const STEP = 250;

export const WaterTracker: React.FC<Props> = ({ date, ml, target, onChange }) => {
  const [loading, setLoading] = React.useState(false);

  const add = async (amount: number) => {
    setLoading(true);
    try {
      await waterApi.add(date, amount);
      onChange?.();
      if (amount > 0) toast.success(`+${fmtMl(amount)} water`);
    } catch {
      toast.error('couldnt add');
    } finally {
      setLoading(false);
    }
  };

  const cups = Math.floor(target / STEP);
  const filled = Math.min(cups, Math.floor(ml / STEP));

  return (
    <Card>
      <CardTitle>water 💧</CardTitle>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-display text-3xl font-bold">{fmtMl(ml)}</div>
          <div className="text-xs text-[var(--color-muted)]">of {fmtMl(target)} goal</div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: cups }).map((_, i) => (
            <div
              key={i}
              className={`h-7 w-3 rounded-full transition-colors ${
                i < filled ? 'bg-[var(--color-info)]' : 'bg-[var(--color-line)]'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="soft" onClick={() => add(250)} loading={loading}>+ 250</Button>
        <Button size="sm" variant="soft" onClick={() => add(500)} loading={loading}>+ 500</Button>
        <Button size="sm" variant="ghost" onClick={() => add(-250)} loading={loading}>- 250</Button>
      </div>
    </Card>
  );
};
