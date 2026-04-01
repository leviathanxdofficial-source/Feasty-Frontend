import * as React from 'react';
import { badgeApi, type Badge } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Empty } from '@/components/ui/empty';

export const BadgesPage: React.FC = () => {
  const [list, setList] = React.useState<Badge[]>([]);
  React.useEffect(() => {
    badgeApi.list().then(setList).catch(() => setList([]));
  }, []);

  return (
    <div className="space-y-3">
      <div className="px-1">
        <div className="font-display text-lg font-bold">badges</div>
        <div className="text-xs text-[var(--color-muted)]">earn em by showing up consistently</div>
      </div>
      {list.length === 0 ? (
        <Empty icon="🏅" title="no badges yet" desc="log some food to start unlocking" />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {list.map((b) => (
            <Card key={b._id} className="text-center tilt-card">
              <div className="text-3xl">{b.icon}</div>
              <div className="font-display text-sm font-semibold">{b.name}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{b.description}</div>
              <div className="mt-1 text-[10px] text-[var(--color-muted)]">
                tier {b.tier} · {new Date(b.earnedAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
