import * as React from 'react';
import { userApi, goalApi, type Me } from '@/lib/api';
import { useAuth } from './AuthContext';

type Ctx = {
  me: Me | null;
  goal: any | null;
  refresh: () => Promise<void>;
};

const ProfileContext = React.createContext<Ctx | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [me, setMe] = React.useState<Me | null>(null);
  const [goal, setGoal] = React.useState<any | null>(null);

  const refresh = React.useCallback(async () => {
    if (!user) return;
    const [m, g] = await Promise.all([userApi.me(), goalApi.current().catch(() => null)]);
    setMe(m);
    setGoal(g);
  }, [user]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return <ProfileContext.Provider value={{ me, goal, refresh }}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile requires ProfileProvider');
  return ctx;
};
