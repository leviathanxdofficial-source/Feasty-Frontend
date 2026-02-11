import { api } from './client';

export type Food = {
  _id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  source: string;
  ownerId?: string | null;
  tags?: string[];
  barcode?: string | null;
};

export const foodApi = {
  async search(q?: string, scope: 'all' | 'mine' | 'system' = 'all') {
    const { data } = await api.get('/food/search', { params: { q, scope } });
    return data as Food[];
  },
  async byBarcode(code: string) {
    const { data } = await api.get('/food/search', { params: { barcode: code } });
    return data as Food[];
  },
  async create(payload: any) {
    const { data } = await api.post('/food', payload);
    return data as Food;
  },
  async patch(id: string, payload: any) {
    const { data } = await api.patch(`/food/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/food/${id}`);
    return data;
  },
  async favorite(id: string) {
    const { data } = await api.post(`/food/${id}/favorite`);
    return data as { favorite: boolean };
  },
  async favorites() {
    const { data } = await api.get('/food/favorites');
    return data as Food[];
  },
};
