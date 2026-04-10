import * as React from 'react';
import { logApi, weightApi, exerciseApi, waterApi } from '@/lib/api';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ymd, addDays } from '@/lib/date';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

const download = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const DataExport: React.FC = () => {
  const today = ymd();
  const monthAgo = ymd(addDays(new Date(), -30));
  const [from, setFrom] = React.useState(monthAgo);
  const [to, setTo] = React.useState(today);
  const [loading, setLoading] = React.useState(false);

  const exportAll = async () => {
    setLoading(true);
    try {
      const [logs, workouts, water, weights] = await Promise.all([
        logApi.range(from, to),
        exerciseApi.range(from, to),
        waterApi.range(from, to),
        weightApi.list(from, to),
      ]);
      const payload = { exportedAt: new Date().toISOString(), from, to, logs, workouts, water, weights };
      download(`feasty-export-${from}-to-${to}.json`, JSON.stringify(payload, null, 2));
      toast.success('exported, check downloads');
    } catch {
      toast.error('export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardTitle>export</CardTitle>
      <CardDesc>get all your logs as json. just in case</CardDesc>
      <div className="mt-2 flex items-center gap-2">
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <span className="text-xs">to</span>
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <Button className="w-full mt-3" loading={loading} onClick={exportAll}>
        <Download className="size-3.5" />download json
      </Button>
    </Card>
  );
};
