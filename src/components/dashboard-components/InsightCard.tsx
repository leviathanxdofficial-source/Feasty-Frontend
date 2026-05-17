import * as React from 'react';
import { insightApi, type Insight } from '@/lib/api';
import { Card, CardTitle } from '@/components/ui/card';
import { Sparkles, ThumbsUp, AlertCircle } from 'lucide-react';

const iconFor = (level: Insight['level']) => {
  if (level === 'good') return <ThumbsUp className="size-4 text-[var(--color-accent)]" />;
  if (level === 'warn') return <AlertCircle className="size-4 text-[var(--color-warn)]" />;
  return <Sparkles className="size-4 text-[var(--color-info)]" />;
};

export const InsightCard: React.FC = () => {
  const [list, setList] = React.useState<Insight[]>([]);
  React.useEffect(() => {
    insightApi.forMe().then(setList).catch(() => setList([]));
  }, []);

  if (list.length === 0) return null;

  return (
    <Card>
      <CardTitle>this week, in a glance</CardTitle>
      <ul className="mt-2 space-y-1.5">
        {list.map((i, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5">{iconFor(i.level)}</span>
            <span>{i.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
