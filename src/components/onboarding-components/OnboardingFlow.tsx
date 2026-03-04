import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle, CardDesc } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { userApi } from '@/lib/api';
import { useProfile } from '@/context/ProfileContext';
import { toast } from 'sonner';

type Step = 'name' | 'body' | 'goal' | 'activity' | 'done';

export const OnboardingFlow: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { refresh } = useProfile();
  const [step, setStep] = React.useState<Step>('name');
  const [form, setForm] = React.useState<any>({
    displayName: '',
    birthDate: '2000-01-01',
    sex: 'female',
    heightCm: 170,
    currentWeightKg: 70,
    targetWeightKg: 65,
    activityLevel: 'moderate',
    goalType: 'lose',
    weeklyRateKg: 0.25,
    notifHour: 8,
  });
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await userApi.onboarding({ ...form, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      await refresh();
      toast.success('all set, lets gooo');
      onComplete?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'couldnt save :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-full place-items-center p-4 dotted-bg">
      <Card className="w-full max-w-md">
        {step === 'name' && (
          <>
            <CardTitle className="text-lg">whats your name?</CardTitle>
            <CardDesc>so feasty can say hi properly</CardDesc>
            <Input
              className="my-3"
              placeholder="your name"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
            <label className="text-xs font-medium">birthday</label>
            <Input
              type="date"
              className="my-1"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
            <label className="text-xs font-medium">sex (for calorie math)</label>
            <Select
              className="my-1"
              value={form.sex}
              onChange={(v) => setForm({ ...form, sex: v })}
              options={[
                { value: 'female', label: 'female' },
                { value: 'male', label: 'male' },
                { value: 'other', label: 'other' },
              ]}
            />
            <Button className="w-full mt-3" onClick={() => setStep('body')} disabled={!form.displayName}>
              next
            </Button>
          </>
        )}
        {step === 'body' && (
          <>
            <CardTitle className="text-lg">tell me about you</CardTitle>
            <CardDesc>tap n drag to set</CardDesc>
            <div className="my-3 space-y-3">
              <div>
                <div className="flex justify-between text-xs"><span>height</span><span>{form.heightCm} cm</span></div>
                <Slider value={form.heightCm} min={100} max={220} onChange={(v) => setForm({ ...form, heightCm: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs"><span>weight now</span><span>{form.currentWeightKg} kg</span></div>
                <Slider value={form.currentWeightKg} min={30} max={200} step={0.5} onChange={(v) => setForm({ ...form, currentWeightKg: v })} />
              </div>
              <div>
                <div className="flex justify-between text-xs"><span>goal weight</span><span>{form.targetWeightKg} kg</span></div>
                <Slider value={form.targetWeightKg} min={30} max={200} step={0.5} onChange={(v) => setForm({ ...form, targetWeightKg: v })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('name')}>back</Button>
              <Button className="flex-1" onClick={() => setStep('goal')}>next</Button>
            </div>
          </>
        )}
        {step === 'goal' && (
          <>
            <CardTitle className="text-lg">whats the vibe?</CardTitle>
            <CardDesc>pick your main goal, no judgement</CardDesc>
            <div className="my-3 grid grid-cols-2 gap-2">
              {[
                { v: 'lose', t: 'lose weight', e: '🥗' },
                { v: 'maintain', t: 'maintain', e: '⚖️' },
                { v: 'gain', t: 'gain', e: '🍔' },
                { v: 'recomp', t: 'recomp', e: '💪' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setForm({ ...form, goalType: opt.v })}
                  className={`rounded-2xl border p-3 text-left transition ${
                    form.goalType === opt.v
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]'
                      : 'border-[var(--color-line)] hover:bg-[var(--color-line)]/30'
                  }`}
                >
                  <div className="text-xl">{opt.e}</div>
                  <div className="text-sm font-medium">{opt.t}</div>
                </button>
              ))}
            </div>
            {form.goalType !== 'maintain' && (
              <div>
                <div className="flex justify-between text-xs"><span>rate / week</span><span>{form.weeklyRateKg} kg</span></div>
                <Slider value={form.weeklyRateKg} min={0.1} max={1} step={0.05} onChange={(v) => setForm({ ...form, weeklyRateKg: v })} />
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Button variant="ghost" onClick={() => setStep('body')}>back</Button>
              <Button className="flex-1" onClick={() => setStep('activity')}>next</Button>
            </div>
          </>
        )}
        {step === 'activity' && (
          <>
            <CardTitle className="text-lg">how active are you?</CardTitle>
            <CardDesc>honesty matters here lol</CardDesc>
            <div className="my-3 space-y-1.5">
              {[
                { v: 'sedentary', t: 'sedentary', d: 'desk all day, barely move' },
                { v: 'light', t: 'lightly active', d: 'walk a bit, light exercise 1-2x/wk' },
                { v: 'moderate', t: 'moderately active', d: 'workout 3-5x/wk' },
                { v: 'active', t: 'active', d: 'workout 6-7x/wk' },
                { v: 'very_active', t: 'very active', d: 'athlete or physical job' },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setForm({ ...form, activityLevel: opt.v })}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    form.activityLevel === opt.v
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)]'
                      : 'border-[var(--color-line)] hover:bg-[var(--color-line)]/30'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.t}</div>
                  <div className="text-[11px] text-[var(--color-muted)]">{opt.d}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep('goal')}>back</Button>
              <Button className="flex-1" loading={loading} onClick={submit}>
                finish setup
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
