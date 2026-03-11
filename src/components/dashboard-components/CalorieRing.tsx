import * as React from 'react';
import { Ring } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

type Props = {
  consumed: number;
  burned: number;
  target: number;
};

export const CalorieRing: React.FC<Props> = ({ consumed, burned, target }) => {
  const net = consumed - burned;
  const remaining = Math.max(0, target - net);
  return (
    <Card className="flex items-center justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-[var(--color-muted)]">remaining</div>
        <div className="font-display text-4xl font-bold">{Math.round(remaining)}</div>
        <div className="text-[11px] text-[var(--color-muted)]">of {Math.round(target)} kcal target</div>
        <div className="mt-2 flex gap-3 text-[11px]">
          <span className="text-[var(--color-text)]">🍽 {Math.round(consumed)}</span>
          <span className="text-[var(--color-accent)]">🔥 -{Math.round(burned)}</span>
        </div>
      </div>
      <Ring
        value={net}
        max={target}
        size={108}
        stroke={10}
        label={
          <div>
            <div className="text-[10px] uppercase text-[var(--color-muted)]">net</div>
            <div className="font-display text-lg font-bold leading-tight">{Math.round(net)}</div>
            <div className="text-[10px] text-[var(--color-muted)]">kcal</div>
          </div>
        }
      />
    </Card>
  );
};
