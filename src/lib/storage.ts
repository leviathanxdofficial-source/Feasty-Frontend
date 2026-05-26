export const kv = {
  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};

export const KEYS = {
  token: 'feasty.token',
  user: 'feasty.user',
  profile: 'feasty.profile',
  goal: 'feasty.goal',
  theme: 'feasty.theme',
  lastDay: 'feasty.lastDay',
  quickFoods: 'feasty.quickFoods',
} as const;
