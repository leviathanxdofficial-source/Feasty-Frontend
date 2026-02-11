import { api } from './client';

export type WeightEntry = {
  _id: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  note?: string;
};

export const weightApi = {
  async list(from?: string, to?: string) {
    const { data } = await api.get('/weight', { params: { from, to } });
    return data as WeightEntry[];
  },
  async movingAverage(windowDays = 7) {
    const { data } = await api.get('/weight/moving-average', { params: { window: windowDays } });
    return data as { date: string; weightKg: number; avg: number }[];
  },
  async add(date: string, weightKg: number, bodyFatPct?: number, note?: string) {
    const { data } = await api.post('/weight', { date, weightKg, bodyFatPct, note });
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/weight/${id}`);
    return data;
  },
};
