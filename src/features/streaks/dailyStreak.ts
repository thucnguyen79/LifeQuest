import type { StreakSummary } from '@/data/repositories/streakSummaryRepository';

type DailyStreakResult = {
  didAdvance: boolean;
  usedStreakFreeze: boolean;
  summary: StreakSummary;
};

function getPreviousDateKey(dateKey: string, days = 1) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

export function advanceDailyStreak(
  summary: StreakSummary,
  completedDateKey: string,
  hasStreakFreeze = false,
  freezeProtectionDays = 1,
): DailyStreakResult {
  if (summary.lastCompletedDate === completedDateKey) {
    return {
      didAdvance: false,
      usedStreakFreeze: false,
      summary,
    };
  }

  const continued = summary.lastCompletedDate === getPreviousDateKey(completedDateKey);
  const usedStreakFreeze =
    hasStreakFreeze &&
    Array.from({ length: Math.max(freezeProtectionDays, 1) }, (_, index) =>
      getPreviousDateKey(completedDateKey, index + 2),
    ).includes(summary.lastCompletedDate ?? '');
  const currentStreak = continued || usedStreakFreeze ? summary.currentStreak + 1 : 1;
  const nextSummary = {
    currentStreak,
    lastCompletedDate: completedDateKey,
    longestStreak: Math.max(summary.longestStreak, currentStreak),
  };

  return {
    didAdvance: true,
    usedStreakFreeze,
    summary: nextSummary,
  };
}
