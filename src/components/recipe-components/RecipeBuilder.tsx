import * as React from 'react';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { foodApi, type Food } from '@/lib/api';
import { toast } from 'sonner';

type Ing = {
  foodId?: string | null;
  name: string;
  servings: number;
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const RecipeBuilder: React.FC<{ onSave: (p: any) => Promise<void> }> = ({ onSave }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [servings, setServings] = React.useState(2);
  const [steps, setSteps] = React.useState('');
  const [ings, setIngs] = React.useState<Ing[]>([]);
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<Food[]>([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const id = setTimeout(async () => {
      if (!q) return setResults([]);
      try {
        const r = await foodApi.search(q);
        setResults(r);
      } catch {
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  const add = (f: Food) => {
    setIngs([...ings, { foodId: f._id, name: f.name, servings: 1, unit: f.servingUnit, kcal: f.kcal, protein: f.protein, carbs: f.carbs, fat: f.fat }]);
    setQ('');
    setResults([]);
  };

  const total = ings.reduce((acc, i) => ({ kcal: acc.kcal + i.kcal * i.servings, protein: acc.protein + i.protein * i.servings, carbs: acc.carbs + i.carbs * i.servings, fat: acc.fat + i.fat * i.servings }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  const submit = async () => {
    if (!name) {
      toast.error('give it a name first');
      return;
    }
    setSaving(true);
    try {
      await onSave({ name, description, servings, ingredients: ings, steps: steps.split('\n').filter(Boolean) });
      toast.success('saved!');
    } catch {
      toast.error('save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <Input placeholder="recipe name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="short desc (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex items-center gap-2">
        <span className="text-xs">makes</span>
        <Input className="w-20" type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} />
        <span className="text-xs">servings</span>
      </div>
      <div>
        <div className="text-xs font-semibold mb-1">ingredients</div>
        <Input placeholder="search to add..." value={q} onChange={(e) => setQ(e.target.value)} />
        {results.length > 0 && (
          <ul className="mt-1 max-h-32 overflow-y-auto scrollbar-thin border border-[var(--color-line)] rounded-xl">
            {results.slice(0, 6).map((r) => (
              <li key={r._id}>
                <button
                  onClick={() => add(r)}
                  className="w-full text-left text-xs px-2 py-1.5 hover:bg-[var(--color-line)]/30"
                >
                  {r.name}{r.brand ? ` · ${r.brand}` : ''} <span className="text-[var(--color-muted)]">({r.kcal} kcal)</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {ings.length > 0 && (
          <ul className="mt-2 space-y-1">
            {ings.map((i, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-xs">
                <span className="flex-1 truncate">{i.name}</span>
                <Input
                  className="w-16 h-8"
                  type="number"
                  step={0.25}
                  value={i.servings}
                  onChange={(e) => {
                    const next = [...ings];
                    next[idx] = { ...i, servings: Number(e.target.value) };
                    setIngs(next);
                  }}
                />
                <Button size="icon" variant="ghost" onClick={() => setIngs(ings.filter((_, j) => j !== idx))}>×</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-xs text-[var(--color-muted)]">
        total: {Math.round(total.kcal)} kcal · P{Math.round(total.protein)} C{Math.round(total.carbs)} F{Math.round(total.fat)}
      </div>
      <Textarea
        placeholder="steps (one per line)"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        rows={3}
      />
      <Button className="w-full" onClick={submit} loading={saving}>save recipe</Button>
    </div>
  );
};
