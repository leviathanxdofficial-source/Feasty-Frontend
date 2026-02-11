import { api } from './client';

export type Profile = {
  userId: string;
  sex?: string;
  heightCm?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  activityLevel?: string;
  goalType?: string;
  weeklyRateKg?: number;
  notifHour?: number;
  timezone?: string;
};

export type Me = {
  user: { id: string; email: string; displayName: string; units: string; onboarded: boolean };
  profile: Profile;
};

export const userApi = {
  async me(): Promise<Me> {
    const { data } = await api.get('/user/me');
    return data;
  },
  async onboarding(payload: any) {
    const { data } = await api.post('/user/onboarding', payload);
    return data;
  },
  async patch(payload: any) {
    const { data } = await api.patch('/user/me', payload);
    return data;
  },
};
