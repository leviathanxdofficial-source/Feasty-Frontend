import * as React from 'react';
import { reminderApi, type Reminder } from '@/lib/api';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const ReminderManager: React.FC = () => {
  const [list, setList] = React.useState<Reminder[]>([]);
  const [kind, setKind] = React.useState('meal');
  const [hour, setHour] = React.useState(8);
  const [minute, setMinute] = React.useState(0);
  const [days, setDays] = React.useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [text, setText] = React.useState('');

  const load = React.useCallback(async () => {
    const r = await reminderApi.list();
    setList(r);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    try {
      await reminderApi.create({ kind, hour, minute, days, enabled: true, text });
      setText('');
      load();
      toast.success('reminder added');
    } catch {
      toast.error('couldnt save');
    }
  };

  const toggle = async (r: Reminder) => {
    await reminderApi.patch(r._id, { enabled: !r.enabled });
    load();
  };

  const remove = async (id: string) => {
    await reminderApi.remove(id);
    load();
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardTitle>new reminder</CardTitle>
        <CardDesc>chrome notification, fires locally when you have the browser open</CardDesc>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Select
            value={kind}
            onChange={setKind}
            options={[
              { value: 'meal', label: 'log a meal' },
              { value: 'water', label: 'drink water' },
              { value: 'weight', label: 'weigh in' },
              { value: 'workout', label: 'move' },
              { value: 'custom', label: 'custom' },
            ]}
          />
          <div className="flex gap-1">
            <Input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(Number(e.target.value))} />
            <Input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(Number(e.target.value))} />
          </div>
        </div>
        <Input className="mt-2" placeholder="custom text (optional)" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2 flex gap-1">
          {DAYS.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(days.includes(i) ? days.filter((x) => x !== i) : [...days, i])}
              className={`flex-1 rounded-lg py-1 text-xs ${
                days.includes(i) ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-line)] text-[var(--color-muted)]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <Button className="w-full mt-2" onClick={create}>add reminder</Button>
      </Card>
      <ul className="space-y-2">
        {list.map((r) => (
          <li key={r._id}>
            <Card className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium capitalize">{r.kind} · {String(r.hour).padStart(2, '0')}:{String(r.minute).padStart(2, '0')}</div>
                <div className="text-[11px] text-[var(--color-muted)]">
                  {r.text || 'gentle nudge'} · {r.days.length === 7 ? 'every day' : r.days.map((d) => DAYS[d]).join(', ')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={r.enabled} onCheckedChange={() => toggle(r)} />
                <Button size="icon" variant="ghost" onClick={() => remove(r._id)} aria-label="remove">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
