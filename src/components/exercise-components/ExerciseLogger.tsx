import * as React from 'react';
import { exerciseApi, type ExerciseCatalog } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

export const ExerciseLogger: React.FC<{ date: string; onDone: () => void }> = ({ date, onDone }) => {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<ExerciseCatalog[]>([]);
  const [picked, setPicked] = React.useState<ExerciseCatalog | null>(null);
  const [type, setType] = React.useState<'cardio' | 'strength'>('cardio');
  const [duration, setDuration] = React.useState(30);
  const [steps, setSteps] = React.useState(0);
  const [intensity, setIntensity] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [sets, setSets] = React.useState<{ reps: number; weightKg: number }[]>([{ reps: 10, weightKg: 20 }]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const r = await exerciseApi.search(q);
        setResults(r);
      } catch {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  React.useEffect(() => {
    if (picked) setType((picked.type === 'strength' ? 'strength' : 'cardio') as any);
  }, [picked]);

  const submit = async () => {
    setLoading(true);
    try {
      const base: any = {
        date,
        exerciseId: picked?._id,
        type,
        intensity,
        durationMin: duration,
        steps,
      };
      if (type === 'strength') {
        base.sets = sets;
      }
      await exerciseApi.log(base);
      toast.success('logged ✨');
      onDone();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'couldnt save');
    } finally {
      setLoading(false);
    }
  };

  if (!picked) {
    return (
      <div className="space-y-2">
        <Input autoFocus placeholder="search exercise..." value={q} onChange={(e) => setQ(e.target.value)} />
        <ul className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin">
          {results.map((r) => (
            <li key={r._id}>
              <button
                onClick={() => setPicked(r)}
                className="w-full text-left rounded-xl border border-[var(--color-line)] p-2.5 hover:bg-[var(--color-line)]/30"
              >
                <div className="text-sm">{r.name}</div>
                <div className="text-[11px] text-[var(--color-muted)]">{r.type} · met {r.met}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{picked.name}</div>
      <div className="text-xs text-[var(--color-muted)]">{picked.type} · met {picked.met}</div>
      {type === 'cardio' ? (
        <>
          <div>
            <label className="text-xs font-medium">duration (min)</label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium">steps (optional)</label>
            <Input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-xs font-medium">intensity</label>
            <Select
              value={intensity}
              onChange={(v) => setIntensity(v as any)}
              options={[
                { value: 'low', label: 'easy' },
                { value: 'medium', label: 'medium' },
                { value: 'high', label: 'hard' },
              ]}
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <label className="text-xs font-medium">sets</label>
            {sets.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <Input
                  type="number"
                  value={s.reps}
                  onChange={(e) => {
                    const next = [...sets];
                    next[i] = { ...s, reps: Number(e.target.value) };
                    setSets(next);
                  }}
                  placeholder="reps"
                />
                <Input
                  type="number"
                  step={0.5}
                  value={s.weightKg}
                  onChange={(e) => {
                    const next = [...sets];
                    next[i] = { ...s, weightKg: Number(e.target.value) };
                    setSets(next);
                  }}
                  placeholder="kg"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSets(sets.filter((_, j) => j !== i))}
                  aria-label="remove set"
                >
                  ×
                </Button>
              </div>
            ))}
            <Button size="sm" variant="soft" onClick={() => setSets([...sets, { reps: 10, weightKg: sets.at(-1)?.weightKg ?? 20 }])}>
              + set
            </Button>
          </div>
        </>
      )}
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setPicked(null)}>back</Button>
        <Button className="flex-1" loading={loading} onClick={submit}>save</Button>
      </div>
    </div>
  );
};
