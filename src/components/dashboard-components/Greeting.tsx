import * as React from 'react';
import { greet } from '@/lib/utils';

const NICE_LINES = [
  'keep being lovely',
  'log it, future you will thank u',
  'small wins still win',
  'snacks count too',
  'water break? jk maybe',
  'one bite at a time',
  'protein hits diff',
  'youre doing great honestly',
];

export const Greeting: React.FC<{ name?: string }> = ({ name }) => {
  const line = React.useMemo(() => NICE_LINES[new Date().getDate() % NICE_LINES.length], []);
  return (
    <div className="px-1">
      <div className="font-display text-xl font-bold">
        {greet()}{name ? `, ${name}` : ''}
      </div>
      <div className="text-xs text-[var(--color-muted)]">{line}</div>
    </div>
  );
};
