import { api } from './client';

export type Insight = {
  kind: 'streak' | 'macro' | 'trend' | 'hydration' | 'consistency' | 'rest';
  level: 'good' | 'neutral' | 'warn';
  text: string;
};

export const insightApi = {
  async forMe() {
    const { data } = await api.get('/insight');
    return data as Insight[];
  },
};
