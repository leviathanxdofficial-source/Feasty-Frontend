import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardTitle } from '@/components/ui/card';
import { round } from '@/lib/utils';

type Props = {
  protein: number;
  carbs: number;
  fat: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
};

const Row: React.FC<{ name: string; value: number; target: number; tint: string }> = ({ name, value, target, tint }) => (
  <div>
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium">{name}</span>
      <span className="text-[var(--color-muted)]">
        {round(value, 1)} / {target}g
      </span>
    </div>
    <Progress value={value} max={target} fillClassName={tint} className="mt-1" />
  </div>
);

export const MacroBars: React.FC<Props> = ({ protein, carbs, fat, proteinTarget, carbsTarget, fatTarget }) => (
  <Card>
    <CardTitle className="mb-3">macros today</CardTitle>
    <div className="space-y-2.5">
      <Row name="protein" value={protein} target={proteinTarget} tint="bg-[var(--color-accent)]" />
      <Row name="carbs" value={carbs} target={carbsTarget} tint="bg-[var(--color-warn)]" />
      <Row name="fat" value={fat} target={fatTarget} tint="bg-[var(--color-info)]" />
    </div>
  </Card>
);
