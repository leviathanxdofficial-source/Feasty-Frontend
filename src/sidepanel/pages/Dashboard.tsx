import * as React from 'react';
import { summaryApi, type DaySummary, logApi, badgeApi } from '@/lib/api';
import { ymd } from '@/lib/date';
import { CalorieRing } from '@/components/dashboard-components/CalorieRing';
import { MacroBars } from '@/components/dashboard-components/MacroBars';
import { WaterTracker } from '@/components/dashboard-components/WaterTracker';
import { StreakChip } from '@/components/dashboard-components/StreakChip';
import { WeekChart } from '@/components/dashboard-components/WeekChart';
import { Greeting } from '@/components/dashboard-components/Greeting';
import { InsightCard } from '@/components/dashboard-components/InsightCard';
import { WeightStrip } from '@/components/dashboard-components/WeightStrip';
import { useProfile } from '@/context/ProfileContext';

export const DashboardPage: React.FC = () => {
  const { me, goal } = useProfile();
  const [day, setDay] = React.useState<DaySummary | null>(null);
  const [streak, setStreak] = React.useState(0);
  const [week, setWeek] = React.useState<DaySummary[]>([]);
  const today = ymd();

  const load = React.useCallback(async () => {
    const [d, w, s] = await Promise.all([
      summaryApi.day(today),
      summaryApi.week(today),
      logApi.streak(),
    ]);
    setDay(d);
    setWeek(w);
    setStreak(s.days);
    badgeApi.evaluate().catch(() => undefined);
  }, [today]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (!day || !goal) {
    return <div className="text-xs text-[var(--color-muted)] text-center pt-10">loading day...</div>;
  }

  return (
    <div className="space-y-3">
      <Greeting name={me?.user.displayName} />
      <CalorieRing consumed={day.intake.kcal} burned={day.burn.kcal} target={goal.kcalTarget} />
      <div className="grid grid-cols-2 gap-3">
        <StreakChip days={streak} />
        <WaterTracker date={today} ml={day.waterMl} target={goal.waterMlTarget} onChange={load} />
      </div>
      <MacroBars
        protein={day.intake.protein}
        carbs={day.intake.carbs}
        fat={day.intake.fat}
        proteinTarget={goal.proteinTarget}
        carbsTarget={goal.carbsTarget}
        fatTarget={goal.fatTarget}
      />
      <WeekChart data={week.map((w) => ({ date: w.date, kcal: w.intake.kcal, target: w.goal?.kcalTarget ?? goal.kcalTarget }))} />
      <WeightStrip />
      <InsightCard />
    </div>
  );
};
