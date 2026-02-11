import axios from 'axios';
import { KEYS, kv } from '../storage';

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await kv.get<string>(KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err?.response?.status === 401) {
      await kv.remove(KEYS.token);
      await kv.remove(KEYS.user);
    }
    return Promise.reject(err);
  },
);
