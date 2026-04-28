import * as React from 'react';
import { kv, KEYS } from '@/lib/storage';

type Theme = 'light' | 'dark' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = React.useState<Theme>('system');

  React.useEffect(() => {
    (async () => {
      const t = (await kv.get<Theme>(KEYS.theme)) ?? 'system';
      apply(t);
      setThemeState(t);
    })();
  }, []);

  const apply = (t: Theme) => {
    const root = document.documentElement;
    const isDark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  };

  const setTheme = async (t: Theme) => {
    await kv.set(KEYS.theme, t);
    apply(t);
    setThemeState(t);
  };

  return { theme, setTheme };
};
