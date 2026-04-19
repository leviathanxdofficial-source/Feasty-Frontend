import * as React from 'react';
import { AuthGate } from '@/components/auth-components/AuthGate';
import { summaryApi, logApi, type DaySummary } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { ymd } from '@/lib/date';
import { CalorieRing } from '@/components/dashboard-components/CalorieRing';
import { MacroBars } from '@/components/dashboard-components/MacroBars';
import { WaterTracker } from '@/components/dashboard-components/WaterTracker';
import { StreakChip } from '@/components/dashboard-components/StreakChip';
import { WeekChart } from '@/components/dashboard-components/WeekChart';
import { Greeting } from '@/components/dashboard-components/Greeting';
import { Card, CardTitle } from '@/components/ui/card';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const { me, goal } = useProfile();
  const [day, setDay] = React.useState<DaySummary | null>(null);
  const [week, setWeek] = React.useState<DaySummary[]>([]);
  const [streak, setStreak] = React.useState(0);
  const today = ymd();

  const load = React.useCallback(async () => {
    if (!user) return;
    const [d, w, s] = await Promise.all([summaryApi.day(today), summaryApi.week(today), logApi.streak()]);
    setDay(d);
    setWeek(w);
    setStreak(s.days);
  }, [today, user]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="min-h-screen p-6 dotted-bg">
      <div className="max-w-5xl mx-auto">
        <AuthGate loading={loading} user={user}>
          <Greeting name={me?.user.displayName} />
          {day && goal ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 space-y-3">
                <CalorieRing consumed={day.intake.kcal} burned={day.burn.kcal} target={goal.kcalTarget} />
                <MacroBars
                  protein={day.intake.protein}
                  carbs={day.intake.carbs}
                  fat={day.intake.fat}
                  proteinTarget={goal.proteinTarget}
                  carbsTarget={goal.carbsTarget}
                  fatTarget={goal.fatTarget}
                />
                <WeekChart data={week.map((w) => ({ date: w.date, kcal: w.intake.kcal, target: w.goal?.kcalTarget ?? goal.kcalTarget }))} />
              </div>
              <div className="space-y-3">
                <StreakChip days={streak} />
                <WaterTracker date={today} ml={day.waterMl} target={goal.waterMlTarget} onChange={load} />
                <Card>
                  <CardTitle>today, in numbers</CardTitle>
                  <div className="mt-2 text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-[var(--color-muted)]">meals logged</span><span>{day.mealCount}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-muted)]">workouts</span><span>{day.workoutCount}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-muted)]">steps</span><span>{day.burn.steps}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--color-muted)]">active min</span><span>{day.burn.durationMin}</span></div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[var(--color-muted)] text-center pt-10">loading...</div>
          )}
        </AuthGate>
      </div>
    </div>
  );
};
