import { api } from './client';

export const waterApi = {
  async day(date: string) {
    const { data } = await api.get('/water/day', { params: { date } });
    return data as { total: number; entries: any[] };
  },
  async range(from: string, to: string) {
    const { data } = await api.get('/water/range', { params: { from, to } });
    return data;
  },
  async add(date: string, amountMl: number, source = 'glass') {
    const { data } = await api.post('/water', { date, amountMl, source });
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/water/${id}`);
    return data;
  },
};
