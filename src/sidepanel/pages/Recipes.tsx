import * as React from 'react';
import { recipeApi, type Recipe } from '@/lib/api';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Empty } from '@/components/ui/empty';
import { RecipeBuilder } from '@/components/recipe-components/RecipeBuilder';
import { Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [open, setOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    const r = await recipeApi.list();
    setRecipes(r);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    try {
      await recipeApi.remove(id);
      load();
    } catch {
      toast.error('couldnt remove');
    }
  };

  const dup = async (id: string) => {
    try {
      await recipeApi.duplicate(id);
      load();
    } catch {
      toast.error('couldnt duplicate');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="font-display text-lg font-bold">my recipes</div>
          <div className="text-xs text-[var(--color-muted)]">build once, log forever</div>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm"><Plus className="size-3.5" />new</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[92vh]">
            <SheetTitle className="font-display text-base font-semibold">build a recipe</SheetTitle>
            <RecipeBuilder
              onSave={async (payload) => {
                await recipeApi.create(payload);
                setOpen(false);
                load();
              }}
            />
          </SheetContent>
        </Sheet>
      </div>
      {recipes.length === 0 ? (
        <Empty icon="🥘" title="no recipes yet" desc="make your fave meals once, save the macros forever" />
      ) : (
        <ul className="space-y-2">
          {recipes.map((r) => (
            <li key={r._id}>
              <Card>
                <CardTitle>{r.name}</CardTitle>
                <CardDesc>{r.servings} servings · {r.totalKcal} kcal total · {Math.round(r.totalKcal / Math.max(1, r.servings))} per serving</CardDesc>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--color-muted)]">
                  <span>P {Math.round(r.totalProtein)}g</span>
                  <span>C {Math.round(r.totalCarbs)}g</span>
                  <span>F {Math.round(r.totalFat)}g</span>
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <Button size="icon" variant="ghost" onClick={() => dup(r._id)} aria-label="duplicate"><Copy className="size-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r._id)} aria-label="remove"><Trash2 className="size-3.5" /></Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
