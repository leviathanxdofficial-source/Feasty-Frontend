import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const SignupCard: React.FC<{ onDone?: () => void; onToLogin?: () => void }> = ({ onDone, onToLogin }) => {
  const { signup } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('pass needs to be 8+');
      return;
    }
    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success('yayy welcome to feasty <3');
      onDone?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <h2 className="font-display text-xl font-semibold">make an account</h2>
      <p className="text-xs text-[var(--color-muted)] mb-3">takes like 10 sec promise</p>
      <form onSubmit={submit} className="space-y-2">
        <Input placeholder="your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="password (8+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" loading={loading} className="w-full">
          create account
        </Button>
      </form>
      <button
        className="mt-3 text-xs text-[var(--color-muted)] underline-offset-2 hover:underline w-full text-center"
        onClick={onToLogin}
      >
        already have one? log in
      </button>
    </Card>
  );
};
