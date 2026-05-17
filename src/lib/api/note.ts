import { api } from './client';

export type Note = {
  _id: string;
  date: string;
  body: string;
  mood?: string;
  createdAt: string;
};

export const noteApi = {
  async list() {
    const { data } = await api.get('/note');
    return data as Note[];
  },
  async day(date: string) {
    const { data } = await api.get('/note/day', { params: { date } });
    return data as Note[];
  },
  async create(payload: { date: string; body: string; mood?: string }) {
    const { data } = await api.post('/note', payload);
    return data as Note;
  },
  async remove(id: string) {
    const { data } = await api.delete(`/note/${id}`);
    return data;
  },
};
