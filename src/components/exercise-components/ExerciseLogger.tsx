import * as React from 'react';
import { exerciseApi, type ExerciseCatalog } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const EXERCISE_CATEGORIES = ['walking', 'running', 'cycling', 'swimming', 'weightlifting', 'yoga', 'sports', 'hiit', 'other'] as const;

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
  const [adding, setAdding] = React.useState(false);
  const [newType, setNewType] = React.useState<'cardio' | 'strength'>('cardio');
  const [newCategory, setNewCategory] = React.useState<typeof EXERCISE_CATEGORIES[number]>('walking');
  const [creating, setCreating] = React.useState(false);

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
          {results.length === 0 && q ? (
            <li className="py-3">
              {!adding ? (
                <div className="text-center space-y-2">
                  <div className="text-xs text-[var(--color-muted)]">nothing found for &quot;{q}&quot;</div>
                  <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
                    + add &quot;{q}&quot; as a custom exercise
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-2 rounded-xl border border-[var(--color-line)] p-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!q.trim()) return;
                    setCreating(true);
                    try {
                      const created = await exerciseApi.addCatalog({
                        name: q.trim(),
                        type: newType,
                        category: newCategory,
                      });
                      setPicked(created);
                      setAdding(false);
                    } catch (err: any) {
                      toast.error(err?.response?.data?.message ?? 'couldnt add');
                    } finally {
                      setCreating(false);
                    }
                  }}
                >
                  <div className="text-xs font-semibold">add custom exercise</div>
                  <div className="text-xs text-[var(--color-muted)]">name: {q}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16">type</span>
                    <Select
                      value={newType}
                      onChange={(v) => setNewType(v as 'cardio' | 'strength')}
                      options={[
                        { value: 'cardio', label: 'cardio' },
                        { value: 'strength', label: 'strength' },
                      ]}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs w-16">category</span>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as typeof EXERCISE_CATEGORIES[number])}
                      className="flex h-9 w-full rounded-md border border-[var(--color-line)] bg-transparent px-2 text-sm"
                    >
                      {EXERCISE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="button" variant="ghost" onClick={() => setAdding(false)} disabled={creating}>
                      cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={creating}>
                      {creating ? 'adding...' : 'add & log'}
                    </Button>
                  </div>
                </form>
              )}
            </li>
          ) : null}
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
