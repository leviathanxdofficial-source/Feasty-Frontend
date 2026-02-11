import { api } from './client';

export type Goal = {
  _id: string;
  kcalTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  fiberTarget: number;
  waterMlTarget: number;
  stepsTarget: number;
  manual: boolean;
};

export const goalApi = {
  async current() {
    const { data } = await api.get('/goal');
    return data as Goal | null;
  },
  async preview() {
    const { data } = await api.get('/goal/preview');
    return data as { bmr: number; tdee: number; activityFactor: number };
  },
  async setManual(payload: Partial<Goal>) {
    const { data } = await api.post('/goal/manual', payload);
    return data as Goal;
  },
  async reset() {
    const { data } = await api.post('/goal/reset');
    return data;
  },
};
