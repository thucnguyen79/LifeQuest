import type { StreakSummary } from '@/data/repositories/streakSummaryRepository';

type DailyStreakResult = {
  didAdvance: boolean;
  summary: StreakSummary;
};

function getPreviousDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function advanceDailyStreak(
  summary: StreakSummary,
  completedDateKey: string,
): DailyStreakResult {
  if (summary.lastCompletedDate === completedDateKey) {
    return {
      didAdvance: false,
      summary,
    };
  }

  const continued = summary.lastCompletedDate === getPreviousDateKey(completedDateKey);
  const currentStreak = continued ? summary.currentStreak + 1 : 1;
  const nextSummary = {
    currentStreak,
    lastCompletedDate: completedDateKey,
    longestStreak: Math.max(summary.longestStreak, currentStreak),
  };

  return {
    didAdvance: true,
    summary: nextSummary,
  };
}
