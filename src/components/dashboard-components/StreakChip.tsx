import * as React from 'react';
import { Card } from '@/components/ui/card';

export const StreakChip: React.FC<{ days: number; longest?: number }> = ({ days, longest }) => (
  <Card className="flex items-center gap-3">
    <div className="text-3xl">🔥</div>
    <div>
      <div className="font-display text-2xl font-bold leading-none">{days}</div>
      <div className="text-[11px] text-[var(--color-muted)]">day streak</div>
    </div>
    {longest && longest > days ? (
      <div className="ml-auto text-right">
        <div className="text-[11px] text-[var(--color-muted)]">longest</div>
        <div className="text-sm font-medium">{longest}d</div>
      </div>
    ) : null}
  </Card>
);
