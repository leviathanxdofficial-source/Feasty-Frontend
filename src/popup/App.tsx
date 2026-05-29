import * as React from 'react';
import { AuthGate } from '@/components/auth-components/AuthGate';
import { summaryApi, logApi, type DaySummary } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { ymd } from '@/lib/date';
import { CalorieRing } from '@/components/dashboard-components/CalorieRing';
import { WaterTracker } from '@/components/dashboard-components/WaterTracker';
import { Greeting } from '@/components/dashboard-components/Greeting';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FoodSearch } from '@/components/diary-components/FoodSearch';
import { Select } from '@/components/ui/select';
import { Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { me, goal } = useProfile();
  const [day, setDay] = React.useState<DaySummary | null>(null);
  const [meal, setMeal] = React.useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(() => {
    const h = new Date().getHours();
    if (h < 10) return 'breakfast';
    if (h < 15) return 'lunch';
    if (h < 20) return 'dinner';
    return 'snack';
  });
  const [open, setOpen] = React.useState(false);
  const today = ymd();

  const load = React.useCallback(async () => {
    try {
      const d = await summaryApi.day(today);
      setDay(d);
    } catch {
      /* noop */
    }
  }, [today]);

  React.useEffect(() => {
    if (user) load();
  }, [user, load]);

  return (
    <div className="mx-auto max-w-md p-4">
      <AuthGate loading={loading} user={user}>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Greeting name={me?.user.displayName} />
            <Button size="icon" variant="ghost" aria-label="open dashboard" onClick={() => navigate('/')}>
              <ExternalLink className="size-4" />
            </Button>
          </div>
          {day && goal ? (
            <>
              <CalorieRing consumed={day.intake.kcal} burned={day.burn.kcal} target={goal.kcalTarget} />
              <WaterTracker date={today} ml={day.waterMl} target={goal.waterMlTarget} onChange={load} />
            </>
          ) : (
            <div className="text-xs text-[var(--color-muted)] text-center pt-4">loading...</div>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button className="w-full"><Plus className="size-3.5" />quick add food</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetTitle className="font-display text-base font-semibold">add to {meal}</SheetTitle>
              <Select
                value={meal}
                onChange={(v) => setMeal(v as any)}
                options={[
                  { value: 'breakfast', label: 'breakfast' },
                  { value: 'lunch', label: 'lunch' },
                  { value: 'dinner', label: 'dinner' },
                  { value: 'snack', label: 'snack' },
                ]}
              />
              <FoodSearch
                onPick={async (f, servings) => {
                  try {
                    await logApi.add({ date: today, meal, foodId: f._id, servings });
                    toast.success(`logged ${f.name}`);
                    setOpen(false);
                    load();
                  } catch {
                    toast.error('save failed');
                  }
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
      </AuthGate>
    </div>
  );
};
