import * as React from 'react';
import { foodApi, type Food } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/badge';

type Props = {
  onPick: (food: Food, servings: number) => void;
};

export const FoodSearch: React.FC<Props> = ({ onPick }) => {
  const [q, setQ] = React.useState('');
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [picked, setPicked] = React.useState<Food | null>(null);
  const [servings, setServings] = React.useState(1);
  const [favs, setFavs] = React.useState<Food[]>([]);

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
          <li className="text-xs text-[var(--color-muted)] py-4 text-center">nothing found for &quot;{q}&quot;</li>
        ) : null}
      </ul>
    </div>
  );
};
