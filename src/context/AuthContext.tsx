import * as React from 'react';
import { authApi, type AuthUser } from '@/lib/api';
import { KEYS, kv } from '@/lib/storage';

type Ctx = {
  user: AuthUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<Ctx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const cached = await kv.get<AuthUser>(KEYS.user);
      const token = await kv.get<string>(KEYS.token);
      if (cached && token) {
        setUser(cached);
        try {
          await authApi.ping();
        } catch {
          await kv.remove(KEYS.token);
          await kv.remove(KEYS.user);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const r = await authApi.signup(email, password, displayName);
    await kv.set(KEYS.token, r.token);
    await kv.set(KEYS.user, r.user);
    setUser(r.user);
  };

  const login = async (email: string, password: string) => {
    const r = await authApi.login(email, password);
    await kv.set(KEYS.token, r.token);
    await kv.set(KEYS.user, r.user);
    setUser(r.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ok */
    }
    await kv.remove(KEYS.token);
    await kv.remove(KEYS.user);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requires AuthProvider');
  return ctx;
};
