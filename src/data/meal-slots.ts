export const MEAL_SLOTS = [
  { id: 'breakfast', label: 'breakfast', emoji: '🌅', startHour: 5 },
  { id: 'lunch', label: 'lunch', emoji: '🥗', startHour: 11 },
  { id: 'dinner', label: 'dinner', emoji: '🍝', startHour: 17 },
  { id: 'snack', label: 'snack', emoji: '🍪', startHour: 0 },
] as const;

export type MealSlotId = (typeof MEAL_SLOTS)[number]['id'];

export const guessMealForNow = (hour = new Date().getHours()): MealSlotId => {
  if (hour < 10) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 20) return 'dinner';
  return 'snack';
};
