const isExt = typeof chrome !== 'undefined' && !!chrome?.storage;

export const kv = {
  async get<T>(key: string): Promise<T | null> {
    if (isExt) {
      const r = await chrome.storage.local.get(key);
      return (r[key] ?? null) as T | null;
    }
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    if (isExt) {
      await chrome.storage.local.set({ [key]: value });
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    if (isExt) {
      await chrome.storage.local.remove(key);
      return;
    }
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
