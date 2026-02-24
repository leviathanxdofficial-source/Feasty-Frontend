import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const LoginCard: React.FC<{ onDone?: () => void; onToSignup?: () => void }> = ({ onDone, onToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('hey welcome back!');
      onDone?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'login failed :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h2 className="font-display text-xl font-semibold">welcome back</h2>
      <p className="text-xs text-[var(--color-muted)] mb-3">missed you tbh</p>
      <form onSubmit={submit} className="space-y-2">
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          log in
        </Button>
      </form>
      <button
        className="mt-3 text-xs text-[var(--color-muted)] underline-offset-2 hover:underline w-full text-center"
        onClick={onToSignup}
      >
        no account yet? make one
      </button>
    </Card>
  );
};
