export const ymd = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseYmd = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const isToday = (d: Date | string) => {
  const a = typeof d === 'string' ? parseYmd(d) : d;
  return ymd(a) === ymd(new Date());
};

export const fmtPretty = (d: string | Date) => {
  const dt = typeof d === 'string' ? parseYmd(d) : d;
  const today = ymd();
  const yes = ymd(addDays(parseYmd(today), -1));
  const cur = ymd(dt);
  if (cur === today) return 'today';
  if (cur === yes) return 'yesterday';
  return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

export const last7days = (end = new Date()) =>
  Array.from({ length: 7 }, (_, i) => ymd(addDays(end, -i))).reverse();

export const last30days = (end = new Date()) =>
  Array.from({ length: 30 }, (_, i) => ymd(addDays(end, -i))).reverse();
