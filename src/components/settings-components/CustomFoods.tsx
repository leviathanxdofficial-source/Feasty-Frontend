import * as React from 'react';
import { foodApi, type Food } from '@/lib/api';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const CustomFoods: React.FC = () => {
  const [list, setList] = React.useState<Food[]>([]);
  const [form, setForm] = React.useState<any>({
    name: '',
    brand: '',
    servingSize: 100,
    servingUnit: 'g',
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const load = React.useCallback(async () => {
    const r = await foodApi.search('', 'mine');
    setList(r);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form.name) {
      toast.error('name?');
      return;
    }
    try {
      await foodApi.create(form);
      toast.success('food added');
      setForm({ ...form, name: '', kcal: 0, protein: 0, carbs: 0, fat: 0 });
      load();
    } catch {
      toast.error('couldnt save');
    }
  };

  const remove = async (id: string) => {
    await foodApi.remove(id);
    load();
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardTitle>add a custom food</CardTitle>
        <CardDesc>for the secret family recipes lol</CardDesc>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Input placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="brand (optional)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <div className="col-span-2 flex gap-1">
            <Input type="number" placeholder="serving size" value={form.servingSize} onChange={(e) => setForm({ ...form, servingSize: Number(e.target.value) })} />
            <Input placeholder="unit" value={form.servingUnit} onChange={(e) => setForm({ ...form, servingUnit: e.target.value })} />
          </div>
          <Input type="number" placeholder="kcal" value={form.kcal} onChange={(e) => setForm({ ...form, kcal: Number(e.target.value) })} />
          <Input type="number" placeholder="protein g" value={form.protein} onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })} />
          <Input type="number" placeholder="carbs g" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: Number(e.target.value) })} />
          <Input type="number" placeholder="fat g" value={form.fat} onChange={(e) => setForm({ ...form, fat: Number(e.target.value) })} />
        </div>
        <Button className="w-full mt-2" onClick={save}>add</Button>
      </Card>
      <div className="space-y-1">
        {list.map((f) => (
          <Card key={f._id} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">{f.name}{f.brand ? ` · ${f.brand}` : ''}</div>
              <div className="text-[11px] text-[var(--color-muted)]">{f.kcal} kcal / {f.servingSize}{f.servingUnit}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(f._id)} aria-label="remove">
              <Trash2 className="size-3.5" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
