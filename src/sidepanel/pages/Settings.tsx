import * as React from 'react';
import { goalApi, userApi, type Goal } from '@/lib/api';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { me, goal, refresh } = useProfile();
  const { logout } = useAuth();
  const [manual, setManual] = React.useState<boolean>(!!goal?.manual);
  const [g, setG] = React.useState<Partial<Goal>>(goal ?? {});
  const [units, setUnits] = React.useState<string>(me?.user.units ?? 'metric');
  const [bmr, setBmr] = React.useState<any>(null);

  React.useEffect(() => {
    setManual(!!goal?.manual);
    setG(goal ?? {});
  }, [goal]);

  React.useEffect(() => {
    goalApi.preview().then(setBmr).catch(() => setBmr(null));
  }, []);

  const saveGoals = async () => {
    try {
      if (manual) {
        await goalApi.setManual(g);
        toast.success('targets locked in');
      } else {
        await goalApi.reset();
        toast.success('back to auto targets');
      }
      refresh();
    } catch {
      toast.error('save failed');
    }
  };

  const saveUnits = async () => {
    try {
      await userApi.patch({ units });
      toast.success('units updated');
      refresh();
    } catch {
      toast.error('couldnt save');
    }
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardTitle>profile</CardTitle>
        <CardDesc>{me?.user.email}</CardDesc>
        <div className="mt-2 text-xs grid grid-cols-2 gap-1">
          <span className="text-[var(--color-muted)]">height</span>
          <span>{me?.profile.heightCm ?? '—'} cm</span>
          <span className="text-[var(--color-muted)]">weight</span>
          <span>{me?.profile.currentWeightKg ?? '—'} kg</span>
          <span className="text-[var(--color-muted)]">goal</span>
          <span className="capitalize">{me?.profile.goalType ?? '—'}</span>
          <span className="text-[var(--color-muted)]">activity</span>
          <span className="capitalize">{me?.profile.activityLevel?.replace('_', ' ') ?? '—'}</span>
        </div>
        {bmr ? (
          <div className="mt-2 text-[11px] text-[var(--color-muted)]">
            bmr {bmr.bmr} · tdee {bmr.tdee} (activity ×{bmr.activityFactor})
          </div>
        ) : null}
      </Card>

      <Card>
        <CardTitle>units</CardTitle>
        <div className="flex gap-2 mt-2">
          <Select
            className="flex-1"
            value={units}
            onChange={setUnits}
            options={[{ value: 'metric', label: 'metric (kg, cm)' }, { value: 'imperial', label: 'imperial (lb, in)' }]}
          />
          <Button onClick={saveUnits}>save</Button>
        </div>
      </Card>

      <Card>
        <CardTitle>targets</CardTitle>
        <CardDesc>auto-set from your profile, override if you wanna</CardDesc>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs">manual override</span>
          <Switch checked={manual} onCheckedChange={setManual} />
        </div>
        {manual ? (
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <label>kcal<Input type="number" value={g.kcalTarget ?? 0} onChange={(e) => setG({ ...g, kcalTarget: Number(e.target.value) })} /></label>
            <label>protein g<Input type="number" value={g.proteinTarget ?? 0} onChange={(e) => setG({ ...g, proteinTarget: Number(e.target.value) })} /></label>
            <label>carbs g<Input type="number" value={g.carbsTarget ?? 0} onChange={(e) => setG({ ...g, carbsTarget: Number(e.target.value) })} /></label>
            <label>fat g<Input type="number" value={g.fatTarget ?? 0} onChange={(e) => setG({ ...g, fatTarget: Number(e.target.value) })} /></label>
            <label>water ml<Input type="number" value={g.waterMlTarget ?? 0} onChange={(e) => setG({ ...g, waterMlTarget: Number(e.target.value) })} /></label>
            <label>steps<Input type="number" value={g.stepsTarget ?? 0} onChange={(e) => setG({ ...g, stepsTarget: Number(e.target.value) })} /></label>
          </div>
        ) : null}
        <Button className="w-full mt-2" onClick={saveGoals}>save</Button>
      </Card>

      <Card>
        <CardTitle>account</CardTitle>
        <Button className="mt-2 w-full" variant="outline" onClick={logout}>log out</Button>
      </Card>
    </div>
  );
};
