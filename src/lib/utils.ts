import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pct = (n: number, of: number) => {
  if (of <= 0) return 0;
  return Math.min(100, Math.round((n / of) * 100));
};

export const round = (n: number, digits = 0) => {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
};

export const fmtKcal = (n: number) => `${Math.round(n)} kcal`;
export const fmtMacro = (n: number) => `${round(n, 1)}g`;
export const fmtMl = (n: number) => (n >= 1000 ? `${round(n / 1000, 1)} L` : `${Math.round(n)} ml`);

export const greet = () => {
  const h = new Date().getHours();
  if (h < 5) return 'still up?';
  if (h < 12) return 'good morning';
  if (h < 17) return 'good afternoon';
  if (h < 21) return 'good evening';
  return 'late night';
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
