import { api } from './client';

export type DaySummary = {
  date: string;
  goal: any;
  intake: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  burn: { kcal: number; steps: number; durationMin: number };
  waterMl: number;
  net: number;
  byMeal: Record<string, { kcal: number; count: number }>;
  mealCount: number;
  workoutCount: number;
};

export const summaryApi = {
  async day(date: string) {
    const { data } = await api.get('/summary/day', { params: { date } });
    return data as DaySummary;
  },
  async week(endDate?: string) {
    const { data } = await api.get('/summary/week', { params: { endDate } });
    return data as DaySummary[];
  },
  async overview() {
    const { data } = await api.get('/summary/overview');
    return data;
  },
};
