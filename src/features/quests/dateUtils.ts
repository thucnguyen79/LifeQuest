import type { Weekday } from '@/data/models/habit';

export function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekdayFromDateKey(dateKey: string): Weekday {
  const date = new Date(`${dateKey}T00:00:00`);
  const day = date.getDay();

  return (day === 0 ? 7 : day) as Weekday;
}
