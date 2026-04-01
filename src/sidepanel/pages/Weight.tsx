import * as React from 'react';
import { weightApi, type WeightEntry } from '@/lib/api';
import { ymd } from '@/lib/date';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';
import { useProfile } from '@/context/ProfileContext';
import { round } from '@/lib/utils';

export const WeightPage: React.FC = () => {
  const { me, refresh } = useProfile();
  const [entries, setEntries] = React.useState<WeightEntry[]>([]);
  const [series, setSeries] = React.useState<{ date: string; weightKg: number; avg: number }[]>([]);
  const [open, setOpen] = React.useState(false);
  const [newWeight, setNewWeight] = React.useState<number>(me?.profile.currentWeightKg ?? 70);
  const [date, setDate] = React.useState(ymd());

  const load = React.useCallback(async () => {
    const [list, avg] = await Promise.all([weightApi.list(), weightApi.movingAverage(7)]);
    setEntries(list);
    setSeries(avg);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    try {
      await weightApi.add(date, newWeight);
      toast.success('weighed in 💪');
      setOpen(false);
      load();
      refresh();
    } catch {
      toast.error('couldnt save');
    }
  };

  const last = entries.at(-1);
  const first = entries[0];
  const delta = last && first ? last.weightKg - first.weightKg : 0;

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)]">current</div>
            <div className="font-display text-2xl font-bold">{last ? `${round(last.weightKg, 1)} kg` : '—'}</div>
            <div className={`text-[11px] ${delta < 0 ? 'text-[var(--color-accent)]' : delta > 0 ? 'text-[var(--color-warn)]' : 'text-[var(--color-muted)]'}`}>
              {delta === 0 ? 'no change yet' : `${delta > 0 ? '+' : ''}${round(delta, 1)} kg since start`}
            </div>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="solid">weigh in</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetTitle className="font-display text-base font-semibold">log weight</SheetTitle>
              <div className="space-y-2">
                <label className="text-xs font-medium">date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <label className="text-xs font-medium">weight (kg)</label>
                <Input type="number" step={0.1} value={newWeight} onChange={(e) => setNewWeight(Number(e.target.value))} />
                <Button className="w-full" onClick={submit}>save</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Card>
      <Card>
        <CardTitle>trend</CardTitle>
        <CardDesc>thin line = each day, thick = 7-day rolling avg</CardDesc>
        <div className="mt-2 h-44">
          <ResponsiveContainer>
            <ReLineChart data={series}>
              <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={32} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--color-line)', fontSize: 11 }} />
              <Line type="monotone" dataKey="weightKg" stroke="var(--color-line)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="avg" stroke="var(--color-brand)" strokeWidth={2.5} dot={false} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
