import { describe, expect, it } from 'vitest';

import { advanceDailyStreak } from './dailyStreak';

describe('advanceDailyStreak', () => {
  it('advances only once per calendar day', () => {
    const first = advanceDailyStreak(
      {
        currentStreak: 0,
        longestStreak: 0,
      },
      '2026-06-16',
    );

    const second = advanceDailyStreak(first.summary, '2026-06-16');

    expect(first.didAdvance).toBe(true);
    expect(first.usedStreakFreeze).toBe(false);
    expect(first.summary).toEqual({
      currentStreak: 1,
      lastCompletedDate: '2026-06-16',
      longestStreak: 1,
    });
    expect(second.didAdvance).toBe(false);
    expect(second.summary.currentStreak).toBe(1);
  });

  it('uses one freeze to preserve a streak across exactly one missed day', () => {
    const result = advanceDailyStreak(
      {
        currentStreak: 4,
        lastCompletedDate: '2026-06-16',
        longestStreak: 4,
      },
      '2026-06-18',
      true,
    );

    expect(result.usedStreakFreeze).toBe(true);
    expect(result.summary).toEqual({
      currentStreak: 5,
      lastCompletedDate: '2026-06-18',
      longestStreak: 5,
    });
  });

  it('does not waste a freeze after a longer gap', () => {
    const result = advanceDailyStreak(
      {
        currentStreak: 4,
        lastCompletedDate: '2026-06-16',
        longestStreak: 4,
      },
      '2026-06-19',
      true,
    );

    expect(result.usedStreakFreeze).toBe(false);
    expect(result.summary.currentStreak).toBe(1);
  });

  it('supports a two-day protection window for the Monk passive', () => {
    const result = advanceDailyStreak(
      {
        currentStreak: 4,
        lastCompletedDate: '2026-06-16',
        longestStreak: 4,
      },
      '2026-06-19',
      true,
      2,
    );

    expect(result.usedStreakFreeze).toBe(true);
    expect(result.summary.currentStreak).toBe(5);
  });

  it('continues consecutive days and resets after a missed day', () => {
    const dayTwo = advanceDailyStreak(
      {
        currentStreak: 1,
        lastCompletedDate: '2026-06-16',
        longestStreak: 1,
      },
      '2026-06-17',
    );
    const afterGap = advanceDailyStreak(dayTwo.summary, '2026-06-19');

    expect(dayTwo.summary.currentStreak).toBe(2);
    expect(dayTwo.summary.longestStreak).toBe(2);
    expect(afterGap.summary.currentStreak).toBe(1);
    expect(afterGap.summary.longestStreak).toBe(2);
  });
});
