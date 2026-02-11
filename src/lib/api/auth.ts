import { api } from './client';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  onboarded?: boolean;
};

export const authApi = {
  async signup(email: string, password: string, displayName: string) {
    const { data } = await api.post('/auth/signup', { email, password, displayName });
    return data as { token: string; user: AuthUser };
  },
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    return data as { token: string; user: AuthUser };
  },
  async logout() {
    await api.post('/auth/logout');
  },
  async ping() {
    const { data } = await api.get('/auth/ping');
    return data;
  },
  async changePassword(oldPassword: string, newPassword: string) {
    const { data } = await api.post('/auth/change-password', { oldPassword, newPassword });
    return data;
  },
};
