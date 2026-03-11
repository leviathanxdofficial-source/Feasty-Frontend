import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';

type Props = { data: { date: string; kcal: number; target: number }[] };

export const WeekChart: React.FC<Props> = ({ data }) => {
  return (
    <Card>
      <CardTitle>this week</CardTitle>
      <CardDesc>kcal eaten per day, line is your target</CardDesc>
      <div className="mt-3 h-44">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 0, right: 4, top: 12, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => {
                const dt = new Date(v + 'T00:00:00');
                return dt.toLocaleDateString(undefined, { weekday: 'short' });
              }}
            />
            <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              cursor={{ fill: 'var(--color-line)' }}
              contentStyle={{ borderRadius: 12, border: '1px solid var(--color-line)', fontSize: 11 }}
            />
            <Bar dataKey="kcal" radius={[10, 10, 6, 6]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.kcal > d.target ? 'var(--color-warn)' : 'var(--color-brand)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
