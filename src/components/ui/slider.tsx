import * as React from 'react';
import * as RSlider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) => (
  <RSlider.Root
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    value={[value]}
    onValueChange={(v) => onChange(v[0])}
    min={min}
    max={max}
    step={step}
  >
    <RSlider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-line)]">
      <RSlider.Range className="absolute h-full bg-[var(--color-brand)]" />
    </RSlider.Track>
    <RSlider.Thumb className="block h-5 w-5 rounded-full border-2 border-[var(--color-brand)] bg-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[var(--color-brand)]/30" />
  </RSlider.Root>
);
