import * as React from 'react';
import { summaryApi, type DaySummary } from '@/lib/api';

export const useDay = (date: string) => {
  const [day, setDay] = React.useState<DaySummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await summaryApi.day(date);
      setDay(r);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [date]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return { day, loading, error, refresh };
};
