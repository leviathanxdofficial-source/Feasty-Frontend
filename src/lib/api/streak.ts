import { api } from './client';

export type Streak = {
  current: number;
  longest: number;
  lastDate: string | null;
  freezesAvailable: number;
};

export const streakApi = {
  async get() {
    const { data } = await api.get('/streak');
    return data as Streak;
  },
  async touch() {
    const { data } = await api.post('/streak/touch');
    return data as Streak;
  },
  async freeze() {
    const { data } = await api.post('/streak/freeze');
    return data as Streak;
  },
};
