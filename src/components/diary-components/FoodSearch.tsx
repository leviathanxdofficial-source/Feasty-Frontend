import * as React from 'react';
import { foodApi, recipeApi, type Food } from '@/lib/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/badge';

type Props = {
  onPick: (food: Food, servings: number) => void;
};

const CATEGORIES = ['drink', 'fast food', 'snack', 'meal', 'dessert', 'fruit', 'other'] as const;

export const FoodSearch: React.FC<Props> = ({ onPick }) => {
  const [q, setQ] = React.useState('');
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [picked, setPicked] = React.useState<Food | null>(null);
  const [servings, setServings] = React.useState(1);
  const [favs, setFavs] = React.useState<Food[]>([]);
  const [adding, setAdding] = React.useState(false);
  const [newKcal, setNewKcal] = React.useState('');
  const [newCategory, setNewCategory] = React.useState<typeof CATEGORIES[number]>('meal');
  const [alsoRecipe, setAlsoRecipe] = React.useState(false);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    foodApi.favorites().then(setFavs).catch(() => undefined);
  }, []);

  React.useEffect(() => {
    const id = setTimeout(async () => {
      try {
        const r = await foodApi.search(q);
        setFoods(r);
      } catch {
        setFoods([]);
      }
    }, 200);
    return () => clearTimeout(id);
  }, [q]);

  if (picked) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-semibold">{picked.name}{picked.brand ? ` · ${picked.brand}` : ''}</div>
        <div className="text-xs text-[var(--color-muted)]">
          per {picked.servingSize} {picked.servingUnit} · {picked.kcal} kcal
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">servings</span>
          <Input
            type="number"
            step={0.1}
            min={0.1}
            value={servings}
            onChange={(e) => setServings(Math.max(0.1, Number(e.target.value)))}
            className="w-24"
          />
        </div>
        <div className="text-xs">
          → {Math.round(picked.kcal * servings)} kcal · P {Math.round(picked.protein * servings)}g · C {Math.round(picked.carbs * servings)}g · F {Math.round(picked.fat * servings)}g
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setPicked(null)}>back</Button>
          <Button className="flex-1" onClick={() => onPick(picked, servings)}>add to diary</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input placeholder="search foods..." value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
      {q.length === 0 && favs.length > 0 ? (
        <div className="space-y-1">
          <div className="text-[11px] text-[var(--color-muted)] uppercase tracking-wider">favorites</div>
          <ul className="space-y-1">
            {favs.slice(0, 6).map((f) => (
              <li key={f._id}>
                <button
                  onClick={() => setPicked(f)}
                  className="w-full text-left rounded-xl border border-[var(--color-line)] p-2.5 hover:bg-[var(--color-line)]/30 transition"
                >
                  <div className="flex justify-between text-sm">
                    <span>{f.name}</span>
                    <span className="text-[var(--color-muted)]">{f.kcal} kcal</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <ul className="space-y-1 max-h-72 overflow-y-auto scrollbar-thin">
        {foods.map((f) => (
          <li key={f._id}>
            <button
              onClick={() => setPicked(f)}
              className="w-full text-left rounded-xl border border-[var(--color-line)] p-2.5 hover:bg-[var(--color-line)]/30 transition"
            >
              <div className="flex justify-between text-sm">
                <span>
                  {f.name}
                  {f.brand ? <span className="text-[var(--color-muted)]"> · {f.brand}</span> : null}
                </span>
                <span className="text-[var(--color-muted)]">{f.kcal} kcal</span>
              </div>
              <div className="mt-0.5 flex gap-1">
                {f.source === 'custom' ? <Pill variant="accent">mine</Pill> : null}
                {f.tags?.slice(0, 2).map((t) => (
                  <Pill key={t} variant="muted">{t}</Pill>
                ))}
              </div>
            </button>
          </li>
        ))}
        {foods.length === 0 && q ? (
          <li className="py-3">
            {!adding ? (
              <div className="text-center space-y-2">
                <div className="text-xs text-[var(--color-muted)]">nothing found for &quot;{q}&quot;</div>
                <Button size="sm" variant="ghost" onClick={() => setAdding(true)}>
                  + add &quot;{q}&quot; as a custom food
                </Button>
              </div>
            ) : (
              <form
                className="space-y-2 rounded-xl border border-[var(--color-line)] p-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const kcal = Number(newKcal);
                  if (!q.trim() || !Number.isFinite(kcal) || kcal <= 0) return;
                  setCreating(true);
                  try {
                    const created = await foodApi.create({
                      name: q.trim(),
                      servingSize: 1,
                      servingUnit: 'serving',
                      kcal,
                      protein: 0,
                      carbs: 0,
                      fat: 0,
                      tags: [newCategory],
                    });
                    if (alsoRecipe) {
                      try {
                        await recipeApi.create({
                          name: q.trim(),
                          servings: 1,
                          ingredients: [{
                            foodId: created._id,
                            name: created.name,
                            servings: 1,
                            unit: created.servingUnit,
                            kcal: created.kcal,
                            protein: created.protein,
                            carbs: created.carbs,
                            fat: created.fat,
                          }],
                          steps: [],
                        });
                        toast.success('saved to recipes');
                      } catch {
                        toast.error('food saved, but recipe failed');
                      }
                    }
                    setPicked(created);
                    setAdding(false);
                    setNewKcal('');
                    setAlsoRecipe(false);
                  } finally {
                    setCreating(false);
                  }
                }}
              >
                <div className="text-xs font-semibold">add custom food</div>
                <div className="text-xs text-[var(--color-muted)]">name: {q}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-16">kcal</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="e.g. 250"
                    value={newKcal}
                    onChange={(e) => setNewKcal(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-16">category</span>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as typeof CATEGORIES[number])}
                    className="flex h-9 w-full rounded-md border border-[var(--color-line)] bg-transparent px-2 text-sm"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={alsoRecipe}
                    onChange={(e) => setAlsoRecipe(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[var(--color-brand)]"
                  />
                  <span>also save as a recipe</span>
                </label>
                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="ghost" onClick={() => setAdding(false)} disabled={creating}>
                    cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={creating || !newKcal}>
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
};
