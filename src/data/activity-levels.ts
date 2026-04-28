export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'sedentary', desc: 'desk all day, barely move', factor: 1.2 },
  { value: 'light', label: 'lightly active', desc: 'walk a bit, light exercise 1-2x/wk', factor: 1.375 },
  { value: 'moderate', label: 'moderately active', desc: 'workout 3-5x/wk', factor: 1.55 },
  { value: 'active', label: 'active', desc: 'workout 6-7x/wk', factor: 1.725 },
  { value: 'very_active', label: 'very active', desc: 'athlete or physical job', factor: 1.9 },
] as const;

export const GOAL_TYPES = [
  { value: 'lose', label: 'lose weight', emoji: '🥗' },
  { value: 'maintain', label: 'maintain', emoji: '⚖️' },
  { value: 'gain', label: 'gain', emoji: '🍔' },
  { value: 'recomp', label: 'recomp', emoji: '💪' },
] as const;
