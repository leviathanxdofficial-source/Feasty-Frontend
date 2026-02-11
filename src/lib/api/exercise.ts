import { api } from './client';

export type ExerciseCatalog = {
  _id: string;
  name: string;
  type: string;
  category: string;
  met: number;
  intensity: string;
  muscles?: string[];
  source: string;
};

export type WorkoutEntry = {
  _id: string;
  date: string;
  name: string;
  type: string;
  durationMin: number;
  distanceKm: number;
  caloriesBurned: number;
  steps: number;
  sets: { reps: number; weightKg: number }[];
  intensity: string;
  note?: string;
};

export const exerciseApi = {
  async search(q?: string, scope: 'all' | 'mine' | 'system' = 'all') {
    const { data } = await api.get('/exercise/search', { params: { q, scope } });
    return data as ExerciseCatalog[];
  },
  async addCatalog(payload: any) {
    const { data } = await api.post('/exercise/catalog', payload);
    return data as ExerciseCatalog;
  },
  async removeCatalog(id: string) {
    const { data } = await api.delete(`/exercise/catalog/${id}`);
    return data;
  },
  async day(date: string) {
    const { data } = await api.get('/exercise/day', { params: { date } });
    return data as WorkoutEntry[];
  },
  async range(from: string, to: string) {
    const { data } = await api.get('/exercise/range', { params: { from, to } });
    return data;
  },
  async log(payload: any) {
    const { data } = await api.post('/exercise/log', payload);
    return data as WorkoutEntry;
  },
  async patchLog(id: string, payload: any) {
    const { data } = await api.patch(`/exercise/log/${id}`, payload);
    return data;
  },
  async removeLog(id: string) {
    const { data } = await api.delete(`/exercise/log/${id}`);
    return data;
  },
};
