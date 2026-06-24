import { describe, expect, it } from 'vitest';

import {
  addLifetimeCoins,
  defaultAchievementProgress,
  syncAchievementProgress,
} from './achievements';

const emptyContext = {
  completedLearningQuests: 0,
  currentCoins: 0,
  longestStreak: 0,
  petLevel: 1,
};

describe('achievement progress', () => {
  it('tracks progress without unlocking early', () => {
    const result = syncAchievementProgress(defaultAchievementProgress, {
      ...emptyContext,
      completedLearningQuests: 9,
      longestStreak: 6,
    });

    expect(result.newlyUnlockedIds).toEqual([]);
    expect(result.achievements.find((item) => item.id === 'learning10')?.current).toBe(9);
  });

  it('unlocks all milestones and persists their timestamps', () => {
    const first = syncAchievementProgress(
      { lifetimeCoinsEarned: 100, unlockedAtById: {} },
      {
        completedLearningQuests: 10,
        currentCoins: 20,
        longestStreak: 7,
        petLevel: 5,
      },
      '2026-06-24T08:00:00.000Z',
    );
    const second = syncAchievementProgress(first.record, emptyContext, '2026-06-25T08:00:00.000Z');

    expect(first.newlyUnlockedIds).toHaveLength(4);
    expect(second.newlyUnlockedIds).toEqual([]);
    expect(second.achievements.every((item) => item.unlocked)).toBe(true);
    expect(second.record.unlockedAtById.streak7).toBe('2026-06-24T08:00:00.000Z');
  });

  it('counts earned coins without subtracting purchases', () => {
    const earned = addLifetimeCoins(defaultAchievementProgress, 30);

    expect(earned.lifetimeCoinsEarned).toBe(30);
    expect(addLifetimeCoins(earned, -12).lifetimeCoinsEarned).toBe(30);
  });

  it('uses the current balance as a migration floor', () => {
    const result = syncAchievementProgress(defaultAchievementProgress, {
      ...emptyContext,
      currentCoins: 100,
    });

    expect(result.record.lifetimeCoinsEarned).toBe(100);
    expect(result.achievements.find((item) => item.id === 'coins100')?.unlocked).toBe(true);
  });
});
