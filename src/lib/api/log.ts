import { api } from './client';

export type LogEntry = {
  _id: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  servings: number;
  servingUnit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  foodId?: string;
  recipeId?: string;
  note?: string;
};

export const logApi = {
  async day(date: string) {
    const { data } = await api.get('/log/day', { params: { date } });
    return data as LogEntry[];
  },
  async range(from: string, to: string) {
    const { data } = await api.get('/log/range', { params: { from, to } });
    return data as LogEntry[];
  },
  async streak() {
    const { data } = await api.get('/log/streak');
    return data as { days: number };
  },
  async add(payload: any) {
    const { data } = await api.post('/log', payload);
    return data as LogEntry;
  },
  async patch(id: string, payload: any) {
    const { data } = await api.patch(`/log/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/log/${id}`);
    return data;
  },
  async copy(fromDate: string, toDate: string, meal?: string) {
    const { data } = await api.post('/log/copy', { fromDate, toDate, meal });
    return data;
  },
};
