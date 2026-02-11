import { api } from './client';

export type Reminder = {
  _id: string;
  kind: string;
  hour: number;
  minute: number;
  days: number[];
  enabled: boolean;
  text?: string;
};

export const reminderApi = {
  async list() {
    const { data } = await api.get('/reminder');
    return data as Reminder[];
  },
  async create(payload: any) {
    const { data } = await api.post('/reminder', payload);
    return data as Reminder;
  },
  async patch(id: string, payload: any) {
    const { data } = await api.patch(`/reminder/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/reminder/${id}`);
    return data;
  },
};
