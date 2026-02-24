import * as React from 'react';
import { LoginCard } from './LoginCard';
import { SignupCard } from './SignupCard';

export const AuthGate: React.FC<{ children: React.ReactNode; loading: boolean; user: any }> = ({
  children,
  loading,
  user,
}) => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  if (loading) {
    return (
      <div className="grid h-full place-items-center">
        <div className="size-8 rounded-full border-2 border-[var(--color-brand)] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="grid min-h-full place-items-center p-4 dotted-bg">
        <div className="space-y-3">
          <div className="text-center font-display text-2xl font-bold">feasty</div>
          <div className="text-center text-xs text-[var(--color-muted)]">tiny calorie tracker, cozy vibes</div>
          {mode === 'login' ? (
            <LoginCard onToSignup={() => setMode('signup')} />
          ) : (
            <SignupCard onToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
