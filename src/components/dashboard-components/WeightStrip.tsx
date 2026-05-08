import * as React from 'react';
import { weightApi, type WeightEntry } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/card';
import { round } from '@/lib/utils';
import { LineChart as ReLineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export const WeightStrip: React.FC = () => {
  const [list, setList] = React.useState<WeightEntry[]>([]);
  React.useEffect(() => {
    weightApi.list().then(setList).catch(() => undefined);
  }, []);
  if (list.length < 2) return null;
  const data = list.map((w) => ({ date: w.date, weightKg: w.weightKg }));
  const first = list[0];
  const last = list.at(-1)!;
  const delta = last.weightKg - first.weightKg;
  return (
    <Card className="flex items-center gap-3">
      <div>
        <CardTitle>weight</CardTitle>
        <div className="text-xs text-[var(--color-muted)]">
          {round(last.weightKg, 1)} kg{' '}
          <span className={delta < 0 ? 'text-[var(--color-accent)]' : delta > 0 ? 'text-[var(--color-warn)]' : ''}>
            ({delta >= 0 ? '+' : ''}{round(delta, 1)})
          </span>
        </div>
      </div>
      <div className="ml-auto h-10 w-32">
        <ResponsiveContainer>
          <ReLineChart data={data}>
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-line)', fontSize: 11 }} />
            <Line type="monotone" dataKey="weightKg" stroke="var(--color-brand)" strokeWidth={2} dot={false} />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
