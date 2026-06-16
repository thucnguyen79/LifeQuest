import { describe, expect, it } from 'vitest';

import type { Quest } from '@/data/models/quest';

import { dailyChestCoinReward, getDailyChestState } from './dailyChest';

function createQuest(status: Quest['status']): Quest {
  return {
    coinReward: 3,
    date: '2026-06-16',
    habitId: `habit-${status}`,
    id: `quest-${status}`,
    status,
    title: status,
    xpReward: 10,
  };
}

describe('getDailyChestState', () => {
  it('locks until every quest for the day is completed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed'), createQuest('pending')],
        {},
      ),
    ).toEqual({
      coinReward: dailyChestCoinReward,
      completedQuestCount: 1,
      date: '2026-06-16',
      status: 'locked',
      totalQuestCount: 2,
    });
  });

  it('becomes available when all quests are completed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed'), createQuest('completed')],
        {},
      ).status,
    ).toBe('available');
  });

  it('stays claimed after the daily reward is claimed', () => {
    expect(
      getDailyChestState(
        '2026-06-16',
        [createQuest('completed')],
        { claimedDate: '2026-06-16' },
      ).status,
    ).toBe('claimed');
  });
});
