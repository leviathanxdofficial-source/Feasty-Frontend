import { api } from './client';

export type Badge = {
  _id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  tier: number;
};

export const badgeApi = {
  async list() {
    const { data } = await api.get('/badges');
    return data as Badge[];
  },
  async evaluate() {
    const { data } = await api.post('/badges/evaluate');
    return data as Badge[];
  },
};
