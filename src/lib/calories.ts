export const kgToLb = (kg: number) => kg * 2.20462;
export const lbToKg = (lb: number) => lb / 2.20462;
export const cmToIn = (cm: number) => cm / 2.54;
export const inToCm = (inch: number) => inch * 2.54;

export const mlToCups = (ml: number) => ml / 236.588;
export const cupsToMl = (c: number) => c * 236.588;

export const macroKcal = (p: number, c: number, f: number) => p * 4 + c * 4 + f * 9;

export const distanceKcal = (distanceKm: number, weightKg = 70, intensity: 'walk' | 'run' = 'walk') => {
  const factor = intensity === 'run' ? 1.0 : 0.53;
  return Math.round(distanceKm * weightKg * factor);
};

export const stepsToKcal = (steps: number, weightKg = 70) => Math.round(steps * 0.0005 * weightKg);

export const progressMessage = (consumed: number, target: number) => {
  const ratio = consumed / target;
  if (ratio < 0.4) return 'still got room';
  if (ratio < 0.85) return 'cruising along nicely';
  if (ratio <= 1.05) return 'pretty much there';
  if (ratio <= 1.2) return 'lil over but its ok';
  return 'past the line, just note it';
};
